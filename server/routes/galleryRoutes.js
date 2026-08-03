const express = require("express");
const router = express.Router();

const {
  getAllGalleryItems,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
} = require("../controllers/galleryController");

const { protect, restrictTo } = require("../middleware/auth");
const { galleryImageUpload } = require("../middleware/upload");

// Public
router.get("/", getAllGalleryItems);

// Private (admin/manager)
router.use(protect, restrictTo("superadmin", "admin", "manager"));

router.post("/", galleryImageUpload.array("images", 20), createGalleryItem);
router.patch("/:id", updateGalleryItem);
router.delete("/:id", deleteGalleryItem);

module.exports = router;
