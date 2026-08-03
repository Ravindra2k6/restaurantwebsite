const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const MenuItem = require("../models/MenuItem");
const { deleteImage } = require("../config/cloudinary");
const logActivity = require("../utils/logActivity");

/**
 * @desc    List menu items with category/type/search/price filters + pagination
 * @route   GET /api/v1/menu
 * @access  Public
 */
const getAllMenuItems = asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit, 10) || 24, 100);
  const skip = (page - 1) * limit;

  const filter = {};

  if (req.query.category) filter.category = req.query.category;
  if (req.query.foodType) filter.foodType = req.query.foodType;
  if (req.query.branch) filter.$or = [{ branches: req.query.branch }, { branches: { $size: 0 } }];
  if (req.query.available !== undefined) filter.isAvailable = req.query.available === "true";
  if (req.query.todaysSpecial === "true") filter.isTodaysSpecial = true;
  if (req.query.popular === "true") filter.isPopular = true;
  if (req.query.chefRecommended === "true") filter.isChefRecommended = true;

  if (req.query.minPrice || req.query.maxPrice) {
    filter.price = {};
    if (req.query.minPrice) filter.price.$gte = Number(req.query.minPrice);
    if (req.query.maxPrice) filter.price.$lte = Number(req.query.maxPrice);
  }

  if (req.query.search) {
    filter.$text = { $search: req.query.search };
  }

  const [items, total] = await Promise.all([
    MenuItem.find(filter)
      .populate("category", "name slug type")
      .sort(req.query.sort || "displayOrder -createdAt")
      .skip(skip)
      .limit(limit),
    MenuItem.countDocuments(filter),
  ]);

  res.status(200).json(
    new ApiResponse(200, "Fetched menu items", items, {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    })
  );
});

const getMenuItemById = asyncHandler(async (req, res) => {
  const item = await MenuItem.findOne({
    $or: [{ _id: req.params.id }, { slug: req.params.id }],
  }).populate("category", "name slug type");

  if (!item) throw new ApiError(404, "Menu item not found");
  res.status(200).json(new ApiResponse(200, "Fetched menu item", item));
});

const createMenuItem = asyncHandler(async (req, res) => {
  const payload = { ...req.body };

  if (typeof payload.variants === "string") payload.variants = JSON.parse(payload.variants);
  if (typeof payload.branches === "string") payload.branches = JSON.parse(payload.branches);
  if (typeof payload.tags === "string") payload.tags = JSON.parse(payload.tags);

  if (req.files?.length) {
    payload.images = req.files.map((file) => ({
      url: file.path,
      publicId: file.filename,
      alt: payload.name || "",
    }));
  }

  const item = await MenuItem.create(payload);

  logActivity(req, {
    action: "create",
    entityType: "MenuItem",
    entityId: item._id,
    description: `Created menu item "${item.name}"`,
  });

  res.status(201).json(new ApiResponse(201, "Menu item created successfully", item));
});

const updateMenuItem = asyncHandler(async (req, res) => {
  const item = await MenuItem.findById(req.params.id);
  if (!item) throw new ApiError(404, "Menu item not found");

  const payload = { ...req.body };
  if (typeof payload.variants === "string") payload.variants = JSON.parse(payload.variants);
  if (typeof payload.branches === "string") payload.branches = JSON.parse(payload.branches);
  if (typeof payload.tags === "string") payload.tags = JSON.parse(payload.tags);

  // Append newly uploaded images to existing ones (removal handled by a
  // dedicated endpoint below to keep this action predictable).
  if (req.files?.length) {
    const newImages = req.files.map((file) => ({
      url: file.path,
      publicId: file.filename,
      alt: payload.name || item.name,
    }));
    payload.images = [...item.images, ...newImages];
  }

  Object.assign(item, payload);
  await item.save();

  logActivity(req, {
    action: "update",
    entityType: "MenuItem",
    entityId: item._id,
    description: `Updated menu item "${item.name}"`,
  });

  res.status(200).json(new ApiResponse(200, "Menu item updated successfully", item));
});

/**
 * @desc    Remove a single image from a menu item's gallery
 * @route   DELETE /api/v1/menu/:id/images/:publicId
 * @access  Private (admin/manager)
 */
const removeMenuItemImage = asyncHandler(async (req, res) => {
  const item = await MenuItem.findById(req.params.id);
  if (!item) throw new ApiError(404, "Menu item not found");

  const { publicId } = req.params;
  const decodedPublicId = decodeURIComponent(publicId);

  const exists = item.images.some((img) => img.publicId === decodedPublicId);
  if (!exists) throw new ApiError(404, "Image not found on this menu item");

  await deleteImage(decodedPublicId);
  item.images = item.images.filter((img) => img.publicId !== decodedPublicId);
  await item.save();

  res.status(200).json(new ApiResponse(200, "Image removed successfully", item));
});

const deleteMenuItem = asyncHandler(async (req, res) => {
  const item = await MenuItem.findById(req.params.id);
  if (!item) throw new ApiError(404, "Menu item not found");

  await Promise.all(item.images.map((img) => deleteImage(img.publicId)));
  await item.deleteOne();

  logActivity(req, {
    action: "delete",
    entityType: "MenuItem",
    entityId: item._id,
    description: `Deleted menu item "${item.name}"`,
  });

  res.status(200).json(new ApiResponse(200, "Menu item deleted successfully", null));
});

/**
 * @desc    Toggle availability quickly (useful for "86'd" items in a live kitchen)
 * @route   PATCH /api/v1/menu/:id/availability
 * @access  Private (admin/manager/staff)
 */
const toggleAvailability = asyncHandler(async (req, res) => {
  const item = await MenuItem.findById(req.params.id);
  if (!item) throw new ApiError(404, "Menu item not found");

  item.isAvailable = req.body.isAvailable ?? !item.isAvailable;
  await item.save();

  res.status(200).json(new ApiResponse(200, "Availability updated", item));
});

module.exports = {
  getAllMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  removeMenuItemImage,
  deleteMenuItem,
  toggleAvailability,
};
