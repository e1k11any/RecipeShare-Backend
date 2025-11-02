/**
 * Wraps an async controller function to catch errors and pass them to the global error handler.
 * @param {Function} fn - The async controller function.
 * @returns {Function} - The wrapped middleware function.
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

module.exports = asyncHandler;
