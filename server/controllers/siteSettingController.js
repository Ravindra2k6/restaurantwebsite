const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const SiteSetting = require("../models/SiteSetting");
const { deleteImage } = require("../config/cloudinary");
const logActivity = require("../utils/logActivity");

/**
 * @desc    Public: fetch site-wide settings (homepage config, SEO defaults, etc.)
 * @route   GET /api/v1/settings
 * @access  Public
 */
const getSettings = asyncHandler(async (req, res) => {
  const settings = await SiteSetting.getSingleton();
  res.status(200).json(new ApiResponse(200, "Fetched site settings", settings));
});

/**
 * @desc    Admin: update any part of the site settings singleton
 * @route   PATCH /api/v1/settings
 * @access  Private (superadmin, admin)
 */
const updateSettings = asyncHandler(async (req, res) => {
  const settings = await SiteSetting.getSingleton();

  const payload = { ...req.body };
  ["seoDefaults", "socialLinks", "contact", "googleBusiness", "analytics", "currency", "theme"].forEach(
    (key) => {
      if (typeof payload[key] === "string") payload[key] = JSON.parse(payload[key]);
    }
  );
  if (typeof payload.supportedLanguages === "string") {
    payload.supportedLanguages = JSON.parse(payload.supportedLanguages);
  }

  if (req.files?.logo?.length) {
    if (settings.logo?.publicId) await deleteImage(settings.logo.publicId);
    payload.logo = { url: req.files.logo[0].path, publicId: req.files.logo[0].filename };
  }
  if (req.files?.favicon?.length) {
    if (settings.favicon?.publicId) await deleteImage(settings.favicon.publicId);
    payload.favicon = { url: req.files.favicon[0].path, publicId: req.files.favicon[0].filename };
  }

  Object.assign(settings, payload);
  await settings.save();

  logActivity(req, {
    action: "update",
    entityType: "SiteSetting",
    entityId: settings._id,
    description: "Updated site-wide settings",
  });

  res.status(200).json(new ApiResponse(200, "Site settings updated successfully", settings));
});

module.exports = { getSettings, updateSettings };
