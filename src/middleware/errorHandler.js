const AppError = require('../utils/AppError');

/**
 * Global error handling middleware.
 */
const errorHandler = (err, req, res, next) => {
  // Set default status code and message
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // --- Handle Specific Mongoose Errors ---

  // 1. Mongoose Duplicate Key Error (code 11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    message = `An account with that ${field} already exists.`;
    statusCode = 400; // Bad Request
  }

  // 2. Mongoose Validation Error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((el) => el.message);
    message = `Invalid input data: ${errors.join('. ')}`;
    statusCode = 400; // Bad Request
  }

  // 3. Mongoose Bad ObjectId Error
  if (err.name === 'CastError') {
    message = `Resource not found with id: ${err.value}`;
    statusCode = 404; // Not Found
  }

  // --- Send Final Response ---
  console.error('ERROR 💥', err);

  res.status(statusCode).json({
    status: 'error',
    message,
    // Provide stack trace only in development
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
