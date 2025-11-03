const User = require('../models/User.model');
const generateToken = require('../utils/generateToken');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const registerUser = asyncHandler(async (req, res, next) => {
  const { username, email, password } = req.body;

  // Note: Our Mongoose 'unique' and 'required' validation will be caught
  // by our global error handler.
  const user = await User.create({
    username,
    email,
    password,
  });

  // User is created, now generate a token
  const token = generateToken(user._id);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    },
  });
});

/**
 * @desc    Authenticate (login) a user
 * @route   POST /api/auth/login
 * @access  Public
 */
const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Find user by email.
  // We MUST explicitly select the password field due to `select: false` in our model.
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new AppError('Invalid email or password', 401));
  }

  // User exists, now compare passwords
  // We use the custom `comparePassword` method we defined on the User model
  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    return next(new AppError('Invalid email or password', 401));
  }

  // Password matches, generate a token
  const token = generateToken(user._id);

  res.status(200).json({
    status: 'success',
    token,
    data: {
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    },
  });
});

/**
 * @desc    Get the current logged-in user's profile
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = asyncHandler(async (req, res, next) => {
  // The 'protect' middleware has already run,
  // so we have 'req.user' available.
  res.status(200).json({
    status: 'success',
    data: {
      user: req.user,
    },
  });
});

module.exports = {
  registerUser,
  loginUser,
  getMe,
};
