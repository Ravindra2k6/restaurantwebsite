const express = require("express");
const router = express.Router();

const {
  getAllJobs,
  getJobById,
  getAllJobsAdmin,
  createJob,
  updateJob,
  deleteJob,
  applyToJob,
  getApplicationsForJob,
  updateApplicationStatus,
} = require("../controllers/careerController");

const { protect, restrictTo } = require("../middleware/auth");
const { resumeUpload } = require("../middleware/upload");
const { publicWriteLimiter } = require("../middleware/rateLimiter");

// Public — job board
router.get("/", getAllJobs);
router.get("/:id", getJobById);
router.post("/:jobId/apply", publicWriteLimiter, resumeUpload.single("resume"), applyToJob);

// Private (admin/manager) — management
router.get("/admin/all", protect, restrictTo("superadmin", "admin", "manager"), getAllJobsAdmin);
router.post("/", protect, restrictTo("superadmin", "admin", "manager"), createJob);
router.patch("/:id", protect, restrictTo("superadmin", "admin", "manager"), updateJob);
router.delete("/:id", protect, restrictTo("superadmin", "admin"), deleteJob);

router.get(
  "/:jobId/applications",
  protect,
  restrictTo("superadmin", "admin", "manager"),
  getApplicationsForJob
);
router.patch(
  "/applications/:id/status",
  protect,
  restrictTo("superadmin", "admin", "manager"),
  updateApplicationStatus
);

module.exports = router;
