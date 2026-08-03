const express = require("express");
const router = express.Router();

const { getDashboardSummary, getVisitorTrend } = require("../controllers/dashboardController");
const { protect, restrictTo } = require("../middleware/auth");

router.use(protect, restrictTo("superadmin", "admin", "manager"));

router.get("/summary", getDashboardSummary);
router.get("/visitor-trend", getVisitorTrend);

module.exports = router;
