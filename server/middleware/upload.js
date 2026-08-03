const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { cloudinary, buildUploader } = require("../config/cloudinary");

// Image uploaders scoped by feature/folder
const menuImageUpload = buildUploader("menu", { maxFiles: 5 });
const branchImageUpload = buildUploader("branches", { maxFiles: 10 });
const galleryImageUpload = buildUploader("gallery", { maxFiles: 20 });
const avatarUpload = buildUploader("avatars", { maxFiles: 1 });
const offerImageUpload = buildUploader("offers", { maxFiles: 1 });
const categoryImageUpload = buildUploader("categories", { maxFiles: 1 });
const reviewAvatarUpload = buildUploader("review-avatars", { maxFiles: 1 });
const siteAssetUpload = buildUploader("site-assets", { maxFiles: 1 });

// Resume uploader — PDFs/docs stored as Cloudinary "raw" resource type
const resumeStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "restaurant-website/resumes",
    resource_type: "raw",
    allowed_formats: ["pdf", "doc", "docx"],
  },
});
const resumeUpload = multer({
  storage: resumeStorage,
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (req, file, cb) => {
    const allowed = /pdf|msword|officedocument.wordprocessingml/;
    if (allowed.test(file.mimetype)) return cb(null, true);
    cb(new Error("Only PDF or Word documents are allowed for resumes"));
  },
});

module.exports = {
  menuImageUpload,
  branchImageUpload,
  galleryImageUpload,
  avatarUpload,
  offerImageUpload,
  categoryImageUpload,
  reviewAvatarUpload,
  siteAssetUpload,
  resumeUpload,
};
