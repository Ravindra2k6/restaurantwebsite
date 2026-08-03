const mongoose = require("mongoose");

/**
 * Minimal, privacy-conscious visit log: one document per page view, used
 * only to power the admin dashboard's "Total Visitors" counter and simple
 * trend chart. No PII beyond a truncated/anonymizable IP is stored.
 * For serious analytics, plug in Google Analytics (see SiteSetting.analytics)
 * instead of relying on this table.
 */
const visitSchema = new mongoose.Schema(
  {
    path: { type: String, required: true },
    ipHash: { type: String }, // hashed, not raw IP
    userAgent: { type: String },
    date: { type: Date, default: Date.now, index: true },
  },
  { timestamps: false }
);

visitSchema.index({ date: 1 });

module.exports = mongoose.model("Visit", visitSchema);
