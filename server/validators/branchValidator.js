const { body } = require("express-validator");

const branchValidator = [
  body("restaurantName").trim().notEmpty().withMessage("Restaurant name is required"),
  body("branchName").trim().notEmpty().withMessage("Branch name is required"),
  body("address.line1").trim().notEmpty().withMessage("Address line is required"),
  body("address.city").trim().notEmpty().withMessage("City is required"),
  body("email").optional().isEmail().withMessage("A valid email is required").normalizeEmail(),
  body("phoneNumbers").optional().isArray().withMessage("Phone numbers must be an array"),
  body("location.coordinates")
    .optional()
    .isArray({ min: 2, max: 2 })
    .withMessage("Coordinates must be [longitude, latitude]"),
  body("parkingAvailable").optional().isBoolean(),
  body("deliveryAvailable").optional().isBoolean(),
  body("reservationAvailable").optional().isBoolean(),
];

module.exports = { branchValidator };
