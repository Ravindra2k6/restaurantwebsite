const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const Category = require("../models/Category");
const MenuItem = require("../models/MenuItem");
const { deleteImage } = require("../config/cloudinary");
const { getAll, getOne } = require("../utils/handlerFactory");

const getAllCategories = getAll(Category, {
  searchableFields: ["name", "description"],
  defaultSort: "displayOrder",
});

const getCategoryById = getOne(Category);

const createCategory = asyncHandler(async (req, res) => {
  const payload = { ...req.body };
  if (req.file) payload.image = { url: req.file.path, publicId: req.file.filename };

  const category = await Category.create(payload);
  res.status(201).json(new ApiResponse(201, "Category created successfully", category));
});

const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) throw new ApiError(404, "Category not found");

  const payload = { ...req.body };

  if (req.file) {
    if (category.image?.publicId) await deleteImage(category.image.publicId);
    payload.image = { url: req.file.path, publicId: req.file.filename };
  }

  Object.assign(category, payload);
  await category.save();

  res.status(200).json(new ApiResponse(200, "Category updated successfully", category));
});

const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) throw new ApiError(404, "Category not found");

  const itemCount = await MenuItem.countDocuments({ category: category._id });
  if (itemCount > 0) {
    throw new ApiError(
      400,
      `Cannot delete: ${itemCount} menu item(s) still reference this category. Reassign or delete them first.`
    );
  }

  if (category.image?.publicId) await deleteImage(category.image.publicId);
  await category.deleteOne();

  res.status(200).json(new ApiResponse(200, "Category deleted successfully", null));
});

module.exports = { getAllCategories, getCategoryById, createCategory, updateCategory, deleteCategory };
