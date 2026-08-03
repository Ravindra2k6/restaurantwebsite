const { validationResult } = require("express-validator");
const ApiError = require("../utils/ApiError");

/**
 * Runs after an array of express-validator checks. Collects any validation
 * failures and throws a single, consistent ApiError so controllers stay clean.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();

  const formatted = errors.array().map((e) => ({
    field: e.path,
    message: e.msg,
  }));

  throw new ApiError(422, "Validation failed", formatted);
};

module.exports = validate;
