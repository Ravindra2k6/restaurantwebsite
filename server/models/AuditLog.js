const mongoose = require("mongoose");

/**
 * Records "who did what, when" for admin-facing mutating actions. Written
 * to via utils/logActivity.js at the point of mutation in controllers,
 * rather than a blanket request-wrapping middleware — this keeps log
 * entries meaningful (human-readable action + entity) instead of a raw
 * dump of every HTTP call.
 */
const auditLogSchema = new mongoose.Schema(
  {
    actor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    actorName: { type: String, required: true }, // denormalized so logs stay readable if the user is later deleted
    actorRole: { type: String, required: true },
    action: {
      type: String,
      required: true,
      enum: ["create", "update", "delete", "login", "login_failed", "logout", "moderate", "status_change"],
    },
    entityType: {
      type: String,
      required: true,
      // Kept as a free-form string rather than an enum so new entity types
      // (added later) don't require a migration — validated at the call site instead.
    },
    entityId: { type: mongoose.Schema.Types.ObjectId },
    description: { type: String, required: true }, // human-readable summary, e.g. "Updated menu item 'Chicken Biryani'"
    metadata: { type: mongoose.Schema.Types.Mixed }, // optional extra context (old/new values, IP, etc.)
    ipAddress: { type: String },
  },
  { timestamps: true }
);

auditLogSchema.index({ createdAt: -1 });
auditLogSchema.index({ actor: 1, createdAt: -1 });
auditLogSchema.index({ entityType: 1, entityId: 1 });

module.exports = mongoose.model("AuditLog", auditLogSchema);
