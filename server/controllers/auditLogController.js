const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const AuditLog = require("../models/AuditLog");

/**
 * @desc    List audit log entries with filters (actor/entityType/action/date range)
 * @route   GET /api/v1/audit-logs
 * @access  Private (superadmin, admin)
 */
const getAuditLogs = asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit, 10) || 30, 100);
  const skip = (page - 1) * limit;

  const filter = {};
  if (req.query.actor) filter.actor = req.query.actor;
  if (req.query.entityType) filter.entityType = req.query.entityType;
  if (req.query.action) filter.action = req.query.action;
  if (req.query.startDate || req.query.endDate) {
    filter.createdAt = {};
    if (req.query.startDate) filter.createdAt.$gte = new Date(req.query.startDate);
    if (req.query.endDate) filter.createdAt.$lte = new Date(req.query.endDate);
  }

  const [logs, total] = await Promise.all([
    AuditLog.find(filter).sort("-createdAt").skip(skip).limit(limit),
    AuditLog.countDocuments(filter),
  ]);

  res.status(200).json(
    new ApiResponse(200, "Fetched audit logs", logs, {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    })
  );
});

module.exports = { getAuditLogs };
