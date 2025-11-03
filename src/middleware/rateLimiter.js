const rateLimit = require('express-rate-limit');
const AppError = require('../utils/AppError');

/**
 * A general-purpose rate limiter for most API routes.
 */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `windowMs`
  message: {
    status: 'error',
    message:
      'Too many requests from this IP, please try again after 15 minutes',
  },
  handler: (req, res, next, options) => {
    // Pass a custom AppError to our global error handler
    next(new AppError(options.message.message, 429)); // 429 Too Many Requests
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

/**
 * A stricter rate limiter for authentication routes (login, register).
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 auth attempts per `windowMs`
  message: {
    status: 'error',
    message:
      'Too many authentication attempts from this IP, please try again after 15 minutes',
  },
  handler: (req, res, next, options) => {
    next(new AppError(options.message.message, 429));
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  apiLimiter,
  authLimiter,
};
