const express = require("express");
const router = express.Router();

const { getSettings, updateSettings } = require("../controllers/siteSettingController");
const { protect, restrictTo } = require("../middleware/auth");
const { siteAssetUpload } = require("../middleware/upload");

// Public
router.get("/", getSettings);

// Private (superadmin/admin)
router.patch(
  "/",
  protect,
  restrictTo("superadmin", "admin"),
  siteAssetUpload.fields([
    { name: "logo", maxCount: 1 },
    { name: "favicon", maxCount: 1 },
  ]),
  updateSettings
);

module.exports = router;
