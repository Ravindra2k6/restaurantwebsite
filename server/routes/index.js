const express = require("express");
const router = express.Router();

router.use("/auth", require("./authRoutes"));
router.use("/users", require("./userRoutes"));
router.use("/categories", require("./categoryRoutes"));
router.use("/menu", require("./menuItemRoutes"));
router.use("/branches", require("./branchRoutes"));
router.use("/gallery", require("./galleryRoutes"));
router.use("/reviews", require("./reviewRoutes"));
router.use("/reservations", require("./reservationRoutes"));
router.use("/contact", require("./contactRoutes"));
router.use("/offers", require("./offerRoutes"));
router.use("/faqs", require("./faqRoutes"));
router.use("/newsletter", require("./newsletterRoutes"));
router.use("/careers", require("./careerRoutes"));
router.use("/settings", require("./siteSettingRoutes"));
router.use("/dashboard", require("./dashboardRoutes"));
router.use("/audit-logs", require("./auditLogRoutes"));
router.use("/search", require("./searchRoutes"));

// Sitemap is exposed under the API base path (e.g. /api/v1/sitemap.xml);
// the frontend proxies/links to it, or a reverse proxy can rewrite
// /sitemap.xml -> this route in production.
router.get("/sitemap.xml", require("../controllers/sitemapController").generateSitemap);

// Simple liveness check for uptime monitors / load balancers
router.get("/health", (req, res) => {
  res.status(200).json({ success: true, message: "API is healthy", timestamp: new Date().toISOString() });
});

module.exports = router;
