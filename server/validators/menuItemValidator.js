const { body } = require("express-validator");

const menuItemValidator = [
  body("name").trim().notEmpty().withMessage("Dish name is required").isLength({ max: 120 }),
  body("description").optional().trim().isLength({ max: 500 }),
  body("category").notEmpty().withMessage("Category is required").isMongoId().withMessage("Invalid category id"),
  body("foodType")
    .notEmpty()
    .withMessage("Food type is required")
    .isIn(["veg", "non-veg", "egg"])
    .withMessage("Food type must be veg, non-veg, or egg"),
  body("price").optional().isFloat({ min: 0 }).withMessage("Price must be a positive number"),
  body("variants").optional().isArray().withMessage("Variants must be an array"),
  body("variants.*.label").optional().trim().notEmpty().withMessage("Variant label is required"),
  body("variants.*.price").optional().isFloat({ min: 0 }).withMessage("Variant price must be positive"),
  body("isAvailable").optional().isBoolean(),
  body("isTodaysSpecial").optional().isBoolean(),
  body("isPopular").optional().isBoolean(),
  body("isChefRecommended").optional().isBoolean(),
  body("spiceLevel").optional().isIn(["mild", "medium", "hot", "extra-hot", "none"]),
];

module.exports = { menuItemValidator };
