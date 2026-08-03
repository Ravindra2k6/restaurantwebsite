const express = require("express");
const router = express.Router();

const {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

const { protect, restrictTo } = require("../middleware/auth");
const { categoryImageUpload } = require("../middleware/upload");
const validate = require("../middleware/validate");
const { categoryValidator } = require("../validators/categoryValidator");

// Public
router.get("/", getAllCategories);
router.get("/:id", getCategoryById);

// Private (admin/manager)
router.use(protect, restrictTo("superadmin", "admin", "manager"));

router.post("/", categoryImageUpload.single("image"), categoryValidator, validate, createCategory);
router.patch("/:id", categoryImageUpload.single("image"), categoryValidator, validate, updateCategory);
router.delete("/:id", restrictTo("superadmin", "admin"), deleteCategory);

module.exports = router;
