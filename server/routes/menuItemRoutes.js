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

// Public
router.get("/", getAllMenuItems);
router.get("/:id", getMenuItemById);

// Private
router.use(protect, restrictTo("superadmin", "admin", "manager", "staff"));

router.patch("/:id/availability", toggleAvailability);

router.use(restrictTo("superadmin", "admin", "manager"));
router.post("/", menuImageUpload.array("images", 5), menuItemValidator, validate, createMenuItem);
router.patch("/:id", menuImageUpload.array("images", 5), menuItemValidator, validate, updateMenuItem);
router.delete("/:id/images/:publicId", removeMenuItemImage);
router.delete("/:id", restrictTo("superadmin", "admin"), deleteMenuItem);

module.exports = router;
