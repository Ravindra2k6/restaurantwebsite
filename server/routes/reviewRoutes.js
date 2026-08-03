const express = require("express");
const router = express.Router();

const {
  getApprovedReviews,
  submitReview,
  getAllReviewsAdmin,
  moderateReview,
  deleteReview,
} = require("../controllers/reviewController");

const { protect, restrictTo } = require("../middleware/auth");
const { reviewAvatarUpload } = require("../middleware/upload");
const { publicWriteLimiter } = require("../middleware/rateLimiter");
const validate = require("../middleware/validate");
const { reviewValidator } = require("../validators/miscValidators");

// Public
router.get("/", getApprovedReviews);
router.post(
  "/",
  publicWriteLimiter,
  reviewAvatarUpload.single("avatar"),
  reviewValidator,
  validate,
  submitReview
);

// Private (admin/manager) — note the distinct /admin path avoids clashing with GET /:id (not used; reviews are listed, not fetched singly)
router.get("/admin/all", protect, restrictTo("superadmin", "admin", "manager"), getAllReviewsAdmin);
router.patch("/:id/moderate", protect, restrictTo("superadmin", "admin", "manager"), moderateReview);
router.delete("/:id", protect, restrictTo("superadmin", "admin"), deleteReview);

module.exports = router;
