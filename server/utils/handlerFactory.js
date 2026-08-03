const asyncHandler = require("./asyncHandler");
const ApiError = require("./ApiError");
const ApiResponse = require("./ApiResponse");

/**
 * Generic factory functions for standard CRUD operations shared by several
 * simple resources (Category, FAQ, Offer, Gallery, etc). Entity-specific
 * controllers can use these directly or wrap them with extra logic
 * (e.g. deleting an associated Cloudinary image before removal).
 */

const getAll = (Model, { searchableFields = [], defaultSort = "-createdAt", populate } = {}) =>
  asyncHandler(async (req, res) => {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
    const skip = (page - 1) * limit;

    const filter = {};

    // Generic equality filters passed via ?field=value for whitelisted keys
    if (req.allowedFilters) {
      req.allowedFilters.forEach((key) => {
        if (req.query[key] !== undefined) filter[key] = req.query[key];
      });
    }

    if (req.query.search && searchableFields.length) {
      filter.$or = searchableFields.map((field) => ({
        [field]: { $regex: req.query.search, $options: "i" },
      }));
    }

    let query = Model.find(filter).sort(req.query.sort || defaultSort).skip(skip).limit(limit);
    if (populate) query = query.populate(populate);

    const [items, total] = await Promise.all([query, Model.countDocuments(filter)]);

    res.status(200).json(
      new ApiResponse(200, "Fetched successfully", items, {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      })
    );
  });

const getOne = (Model, { populate } = {}) =>
  asyncHandler(async (req, res) => {
    let query = Model.findById(req.params.id);
    if (populate) query = query.populate(populate);
    const doc = await query;
    if (!doc) throw new ApiError(404, `${Model.modelName} not found`);
    res.status(200).json(new ApiResponse(200, "Fetched successfully", doc));
  });

const createOne = (Model) =>
  asyncHandler(async (req, res) => {
    const doc = await Model.create(req.body);
    res.status(201).json(new ApiResponse(201, `${Model.modelName} created successfully`, doc));
  });

const updateOne = (Model) =>
  asyncHandler(async (req, res) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) throw new ApiError(404, `${Model.modelName} not found`);
    res.status(200).json(new ApiResponse(200, `${Model.modelName} updated successfully`, doc));
  });

const deleteOne = (Model) =>
  asyncHandler(async (req, res) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) throw new ApiError(404, `${Model.modelName} not found`);
    res.status(200).json(new ApiResponse(200, `${Model.modelName} deleted successfully`, null));
  });

module.exports = { getAll, getOne, createOne, updateOne, deleteOne };
