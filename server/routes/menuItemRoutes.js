const express = require("express");
const router = express.Router();

const {
  getAllMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  removeMenuItemImage,
  deleteMenuItem,
  toggleAvailability,
} = require("../controllers/menuItemController");

const { protect, restrictTo } = require("../middleware/auth");
const { menuImageUpload } = require("../middleware/upload");
const validate = require("../middleware/validate");
const { menuItemValidator } = require("../validators/menuItemValidator");
const { body } = require("express-validator");

// Convert multipart JSON strings into values before validation.
const parseMenuItemFields = (req, res, next) => {
  for (const field of ["variants", "branches", "tags"]) {
    if (typeof req.body[field] === "string") {
      try {
        req.body[field] = JSON.parse(req.body[field]);
      } catch {
        return res.status(422).json({
          success: false,
          message: `Invalid JSON in ${field}`,
          errors: [
            {
              field,
              message: `${field} must contain valid JSON`,
            },
          ],
        });
      }
    }
  }

  next();
};

// Public
router.get("/", getAllMenuItems);
router.get("/:id", getMenuItemById);

// Private
router.use(protect, restrictTo("superadmin", "admin", "manager", "staff"));

router.patch("/:id/availability", toggleAvailability);

router.use(restrictTo("superadmin", "admin", "manager"));

router.post(
  "/",
  menuImageUpload.array("images", 5),
  parseMenuItemFields,
  menuItemValidator,
  validate,
  createMenuItem,
);

router.patch(
  "/:id",
  menuImageUpload.array("images", 5),
  parseMenuItemFields,
  menuItemValidator,
  validate,
  updateMenuItem,
);

router.delete("/:id/images/:publicId", removeMenuItemImage);
router.delete("/:id", restrictTo("superadmin", "admin"), deleteMenuItem);

module.exports = router;
