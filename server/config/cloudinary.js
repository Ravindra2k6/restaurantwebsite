const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * Builds a multer instance configured to stream uploads directly to a given
 * Cloudinary folder. Keeping this as a factory lets each route control where
 * its images land (menu/, branches/, gallery/, etc.) without duplicating code.
 */
const buildUploader = (folder, { maxFiles = 10, maxSizeMB = 5 } = {}) => {
  const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: `restaurant-website/${folder}`,
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
      transformation: [{ width: 1600, crop: "limit", quality: "auto:good" }],
    },
  });

  const fileFilter = (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    const extOk = allowed.test(file.mimetype);
    if (extOk) return cb(null, true);
    cb(new Error("Only image files (jpg, jpeg, png, webp) are allowed"));
  };

  return multer({
    storage,
    fileFilter,
    limits: {
      fileSize: maxSizeMB * 1024 * 1024,
      files: maxFiles,
    },
  });
};

/**
 * Deletes an image from Cloudinary given its public_id.
 * Safe to call even if the id doesn't exist — Cloudinary just returns "not found".
 */
const deleteImage = async (publicId) => {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.error(`Cloudinary deletion failed for ${publicId}: ${err.message}`);
  }
};

module.exports = { cloudinary, buildUploader, deleteImage };
