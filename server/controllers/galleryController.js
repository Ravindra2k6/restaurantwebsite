const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const Gallery = require("../models/Gallery");
const { deleteImage } = require("../config/cloudinary");

const getAllGalleryItems = asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit, 10) || 24, 100);
  const skip = (page - 1) * limit;

  const filter = {};
  if (req.query.category) filter.category = req.query.category;
  if (req.query.branch) filter.branch = req.query.branch;
  if (req.query.featured === "true") filter.isFeatured = true;

  const [items, total] = await Promise.all([
    Gallery.find(filter).sort("displayOrder -createdAt").skip(skip).limit(limit),
    Gallery.countDocuments(filter),
  ]);

  res.status(200).json(
    new ApiResponse(200, "Fetched gallery items", items, {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    })
  );
});

const createGalleryItem = asyncHandler(async (req, res) => {
  if (!req.files?.length) throw new ApiError(400, "At least one image is required");

  const docs = req.files.map((file) => ({
    title: req.body.title,
    caption: req.body.caption,
    category: req.body.category,
    branch: req.body.branch || null,
    isFeatured: req.body.isFeatured === "true",
    image: { url: file.path, publicId: file.filename, alt: req.body.title || "" },
  }));

  const created = await Gallery.insertMany(docs);
  res.status(201).json(new ApiResponse(201, "Gallery item(s) uploaded successfully", created));
});

const updateGalleryItem = asyncHandler(async (req, res) => {
  const item = await Gallery.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!item) throw new ApiError(404, "Gallery item not found");
  res.status(200).json(new ApiResponse(200, "Gallery item updated successfully", item));
});

const deleteGalleryItem = asyncHandler(async (req, res) => {
  const item = await Gallery.findByIdAndDelete(req.params.id);
  if (!item) throw new ApiError(404, "Gallery item not found");
  if (item.image?.publicId) await deleteImage(item.image.publicId);
  res.status(200).json(new ApiResponse(200, "Gallery item deleted successfully", null));
});

module.exports = { getAllGalleryItems, createGalleryItem, updateGalleryItem, deleteGalleryItem };
