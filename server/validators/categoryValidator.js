const { body } = require("express-validator");

const categoryValidator = [
  body("name").trim().notEmpty().withMessage("Category name is required").isLength({ max: 60 }),
  body("description").optional().trim().isLength({ max: 300 }),
  body("type")
    .optional()
    .isIn(["veg", "non-veg", "egg", "dessert", "drink", "mixed"])
    .withMessage("Invalid category type"),
  body("displayOrder").optional().isInt().withMessage("Display order must be an integer"),
];

module.exports = { categoryValidator };
