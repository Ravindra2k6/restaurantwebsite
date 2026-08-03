const crypto = require("crypto");
const Visit = require("../models/Visit");

/**
 * Fire-and-forget visit logger. Mounted globally in app.js for public GET
 * requests only, so it doesn't skew counts with admin/API traffic.
 * Hashes the IP (never stores it raw) and never blocks the response.
 */
const trackVisit = (req, res, next) => {
  if (req.method === "GET" && !req.originalUrl.startsWith("/api/v1/dashboard")) {
    const ipHash = crypto.createHash("sha256").update(req.ip || "unknown").digest("hex");
    Visit.create({
      path: req.originalUrl,
      ipHash,
      userAgent: req.headers["user-agent"],
    }).catch(() => {
      /* Analytics must never break the actual request */
    });
  }
  next();
};

module.exports = trackVisit;
