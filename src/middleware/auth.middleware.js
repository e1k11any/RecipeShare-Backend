const jwt = require('jsonwebtoken');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const User = require('../models/User.model');

/**
 * Middleware to protect routes.
 * Verifies the JWT and attaches the user to the request object.
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // 1) Check if the 'Authorization' header exists and starts with 'Bearer'
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // 2) If no token is found, return an error
  if (!token) {
    return next(new AppError('Not authorized, no token provided', 401));
  }

  try {
    // 3) Verify the token
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined in environment variables.');
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4) Find the user by the ID from the token payload
    // We explicitly exclude the password field
    const currentUser = await User.findById(decoded.id).select('-password');

    if (!currentUser) {
      return next(
        new AppError('The user belonging to this token no longer exists.', 401),
      );
    }

    // 5) Attach the user object to the request for use in subsequent routes
    req.user = currentUser;
    next();
  } catch (error) {
    // Handle specific JWT errors
    if (error.name === 'JsonWebTokenError') {
      return next(new AppError('Not authorized, invalid token', 401));
    }
    if (error.name === 'TokenExpiredError') {
      return next(new AppError('Not authorized, token expired', 401));
    }
    // Pass other errors to the global error handler
    next(error);
  }
});

module.exports = { protect };
