const express = require("express");
const router = express.Router();

const {
  getActiveOffers,
  validateCoupon,
  getAllOffersAdmin,
  createOffer,
  updateOffer,
  deleteOffer,
} = require("../controllers/offerController");

const { protect, restrictTo } = require("../middleware/auth");
const { offerImageUpload } = require("../middleware/upload");
const validate = require("../middleware/validate");
const { offerValidator } = require("../validators/miscValidators");

// Public
router.get("/", getActiveOffers);
router.get("/validate/:code", validateCoupon);

// Private (admin/manager)
router.get("/admin/all", protect, restrictTo("superadmin", "admin", "manager"), getAllOffersAdmin);
router.post(
  "/",
  protect,
  restrictTo("superadmin", "admin", "manager"),
  offerImageUpload.single("image"),
  offerValidator,
  validate,
  createOffer
);
router.patch(
  "/:id",
  protect,
  restrictTo("superadmin", "admin", "manager"),
  offerImageUpload.single("image"),
  offerValidator,
  validate,
  updateOffer
);
router.delete("/:id", protect, restrictTo("superadmin", "admin"), deleteOffer);

module.exports = router;
