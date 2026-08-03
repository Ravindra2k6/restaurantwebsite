const express = require("express");
const router = express.Router();

const {
  getAuditLogs,
  getEntityTypes,
} = require("../controllers/auditLogController");
const { protect, restrictTo } = require("../middleware/auth");

router.use(protect, restrictTo("superadmin", "admin"));

router.get("/", getAuditLogs);
//router.get("/entity-types", getEntityTypes);

module.exports = router;
