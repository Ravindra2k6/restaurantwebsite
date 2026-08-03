/**
 * Wraps an async controller function and forwards any rejected promise
 * to Express's error-handling middleware via next(err).
 * Avoids repetitive try/catch blocks in every controller.
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
