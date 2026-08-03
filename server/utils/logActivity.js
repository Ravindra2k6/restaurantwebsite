const AuditLog = require("../models/AuditLog");

/**
 * Fire-and-forget audit log writer. Call this from a controller right after
 * a mutation succeeds. Never awaited by the caller and never throws —
 * logging failures must not break the actual user-facing action.
 *
 * Usage:
 *   logActivity(req, { action: "update", entityType: "MenuItem", entityId: item._id,
 *     description: `Updated menu item "${item.name}"` });
 */
const logActivity = (req, { action, entityType, entityId, description, metadata }) => {
  if (!req.user) return; // only authenticated admin actions are logged

  AuditLog.create({
    actor: req.user._id,
    actorName: req.user.name,
    actorRole: req.user.role,
    action,
    entityType,
    entityId,
    description,
    metadata,
    ipAddress: req.ip,
  }).catch((err) => {
    console.error(`Audit log write failed: ${err.message}`);
  });
};

module.exports = logActivity;
