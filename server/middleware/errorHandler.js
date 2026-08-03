const ApiError = require("../utils/ApiError");

/**
 * Converts known error types (Mongoose cast errors, duplicate keys,
 * validation errors, JWT errors, Multer errors) into consistent ApiErrors.
 */
const normalizeError = (err) => {
  let error = err;

  // Invalid MongoDB ObjectId
  if (err.name === "CastError") {
    error = new ApiError(400, `Invalid value for field '${err.path}': ${err.value}`);
  }

  // Duplicate key error (e.g. unique email, slug, coupon code)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0];
    const value = err.keyValue ? err.keyValue[field] : "";
    error = new ApiError(409, `Duplicate value for '${field}': '${value}' already exists`);
  }

  // Mongoose schema validation errors
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((val) => val.message);
    error = new ApiError(400, "Validation failed", messages);
  }

  // JWT errors (fallback — most are already caught in auth middleware)
  if (err.name === "JsonWebTokenError") {
    error = new ApiError(401, "Invalid token");
  }
  if (err.name === "TokenExpiredError") {
    error = new ApiError(401, "Token expired");
  }

  // Multer upload errors
  if (err.name === "MulterError") {
    error = new ApiError(400, `Upload error: ${err.message}`);
  }

  return error;
};

/**
 * 404 handler for unmatched routes — must be registered after all routes.
 */
const notFound = (req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};

/**
 * Centralized error handler — must be registered last, after all routes
 * and other middleware.
 */
const errorHandler = (err, req, res, next) => {
  let error = normalizeError(err);

  if (!(error instanceof ApiError)) {
    error = new ApiError(err.statusCode || 500, err.message || "Internal Server Error");
  }

  const statusCode = error.statusCode || 500;

  if (process.env.NODE_ENV === "development") {
    console.error(err);
  }

  res.status(statusCode).json({
    success: false,
    statusCode,
    message: error.message,
    errors: error.errors && error.errors.length ? error.errors : undefined,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

module.exports = { errorHandler, notFound };
