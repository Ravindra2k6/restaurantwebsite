const asyncHandler = require("../utils/asyncHandler");
const Branch = require("../models/Branch");
const Category = require("../models/Category");
const MenuItem = require("../models/MenuItem");
const Job = require("../models/Job");

const STATIC_PAGES = [
  { path: "/", priority: "1.0", changefreq: "daily" },
  { path: "/about", priority: "0.7", changefreq: "monthly" },
  { path: "/menu", priority: "0.9", changefreq: "daily" },
  { path: "/branches", priority: "0.8", changefreq: "weekly" },
  { path: "/gallery", priority: "0.6", changefreq: "weekly" },
  { path: "/offers", priority: "0.8", changefreq: "daily" },
  { path: "/reviews", priority: "0.6", changefreq: "weekly" },
  { path: "/reservation", priority: "0.9", changefreq: "monthly" },
  { path: "/careers", priority: "0.5", changefreq: "weekly" },
  { path: "/contact", priority: "0.6", changefreq: "monthly" },
];

const urlEntry = (loc, lastmod, changefreq, priority) => `
  <url>
    <loc>${loc}</loc>
    ${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;

/**
 * @desc    Generates sitemap.xml dynamically from live content -- static
 *          pages plus every active branch, category, menu item, and open
 *          job listing, so new content is discoverable by search engines
 *          without a manual rebuild.
 * @route   GET /api/v1/sitemap.xml
 * @access  Public
 */
const generateSitemap = asyncHandler(async (req, res) => {
  const siteUrl = (process.env.CLIENT_URL || "http://localhost:5173").replace(/\/$/, "");

  const [branches, categories, menuItems, jobs] = await Promise.all([
    Branch.find({ isActive: true }).select("slug updatedAt"),
    Category.find({ isActive: true }).select("slug updatedAt"),
    MenuItem.find({ isAvailable: true }).select("slug updatedAt"),
    Job.find({ isActive: true }).select("slug updatedAt"),
  ]);

  const staticUrls = STATIC_PAGES.map((p) =>
    urlEntry(`${siteUrl}${p.path}`, null, p.changefreq, p.priority)
  ).join("");

  const branchUrls = branches
    .map((b) => urlEntry(`${siteUrl}/branches/${b.slug}`, b.updatedAt.toISOString(), "weekly", "0.7"))
    .join("");

  const categoryUrls = categories
    .map((c) => urlEntry(`${siteUrl}/menu?category=${c.slug}`, c.updatedAt.toISOString(), "weekly", "0.6"))
    .join("");

  const menuUrls = menuItems
    .map((m) => urlEntry(`${siteUrl}/menu/${m.slug}`, m.updatedAt.toISOString(), "weekly", "0.6"))
    .join("");

  const jobUrls = jobs
    .map((j) => urlEntry(`${siteUrl}/careers/${j.slug}`, j.updatedAt.toISOString(), "weekly", "0.5"))
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${staticUrls}${branchUrls}${categoryUrls}${menuUrls}${jobUrls}
</urlset>`;

  res.set("Content-Type", "application/xml");
  res.send(xml);
});

module.exports = { generateSitemap };
