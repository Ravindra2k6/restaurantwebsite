const express = require("express");
const router = express.Router();

const {
  getAllBranches,
  getBranchById,
  getNearbyBranches,
  createBranch,
  updateBranch,
  removeBranchImage,
  deleteBranch,
} = require("../controllers/branchController");

const { getGoogleReviewsForBranch } = require("../controllers/googleReviewController");

const { protect, restrictTo } = require("../middleware/auth");
const { branchImageUpload } = require("../middleware/upload");
const validate = require("../middleware/validate");
const { branchValidator } = require("../validators/branchValidator");

const branchUploadFields = branchImageUpload.fields([
  { name: "images", maxCount: 10 },
  { name: "banner", maxCount: 1 },
]);

// Public
router.get("/", getAllBranches);
router.get("/nearby", getNearbyBranches);
router.get("/:id", getBranchById);
router.get("/:id/google-reviews", getGoogleReviewsForBranch);

// Private (admin/manager)
router.use(protect, restrictTo("superadmin", "admin", "manager"));

router.post("/", branchUploadFields, branchValidator, validate, createBranch);
router.patch("/:id", branchUploadFields, branchValidator, validate, updateBranch);
router.delete("/:id/images/:publicId", removeBranchImage);
router.delete("/:id", restrictTo("superadmin", "admin"), deleteBranch);

module.exports = router;
