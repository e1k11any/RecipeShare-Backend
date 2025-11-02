/**
 * A custom error class for operational, trusted errors.
 * @extends Error
 */
class AppError extends Error {
  /**
   * Creates an instance of AppError.
   * @param {string} message - The error message.
   * @param {number} statusCode - The HTTP status code.
   */
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    // Differentiate between "operational" (our) errors and programming errors
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
