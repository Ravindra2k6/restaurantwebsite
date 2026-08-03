const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const Branch = require("../models/Branch");
const { deleteImage } = require("../config/cloudinary");
const logActivity = require("../utils/logActivity");

/**
 * @desc    List all branches (supports ?city= and ?active=true filters)
 * @route   GET /api/v1/branches
 * @access  Public
 */
const getAllBranches = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.city) filter["address.city"] = { $regex: req.query.city, $options: "i" };
  if (req.query.active !== undefined) filter.isActive = req.query.active === "true";

  const branches = await Branch.find(filter).sort("branchName");
  res.status(200).json(new ApiResponse(200, "Fetched branches", branches));
});

const getBranchById = asyncHandler(async (req, res) => {
  const branch = await Branch.findOne({
    $or: [{ _id: req.params.id }, { slug: req.params.id }],
  });
  if (!branch) throw new ApiError(404, "Branch not found");
  res.status(200).json(new ApiResponse(200, "Fetched branch", branch));
});

/**
 * @desc    Find the nearest branch(es) to a given lat/lng
 * @route   GET /api/v1/branches/nearby?lat=..&lng=..&maxDistanceKm=10
 * @access  Public
 */
const getNearbyBranches = asyncHandler(async (req, res) => {
  const { lat, lng, maxDistanceKm = 15 } = req.query;
  if (!lat || !lng) throw new ApiError(400, "lat and lng query parameters are required");

  const branches = await Branch.find({
    isActive: true,
    location: {
      $near: {
        $geometry: { type: "Point", coordinates: [Number(lng), Number(lat)] },
        $maxDistance: Number(maxDistanceKm) * 1000,
      },
    },
  }).limit(10);

  res.status(200).json(new ApiResponse(200, "Fetched nearby branches", branches));
});

const createBranch = asyncHandler(async (req, res) => {
  const payload = { ...req.body };

  if (typeof payload.address === "string") payload.address = JSON.parse(payload.address);
  if (typeof payload.openingHours === "string") payload.openingHours = JSON.parse(payload.openingHours);
  if (typeof payload.location === "string") payload.location = JSON.parse(payload.location);
  if (typeof payload.facilities === "string") payload.facilities = JSON.parse(payload.facilities);
  if (typeof payload.phoneNumbers === "string") payload.phoneNumbers = JSON.parse(payload.phoneNumbers);

  if (req.files?.images?.length) {
    payload.images = req.files.images.map((file) => ({
      url: file.path,
      publicId: file.filename,
      alt: payload.branchName || "",
    }));
  }
  if (req.files?.banner?.length) {
    payload.banner = { url: req.files.banner[0].path, publicId: req.files.banner[0].filename };
  }

  const branch = await Branch.create(payload);

  logActivity(req, {
    action: "create",
    entityType: "Branch",
    entityId: branch._id,
    description: `Created branch "${branch.branchName}"`,
  });

  res.status(201).json(new ApiResponse(201, "Branch created successfully", branch));
});

const updateBranch = asyncHandler(async (req, res) => {
  const branch = await Branch.findById(req.params.id);
  if (!branch) throw new ApiError(404, "Branch not found");

  const payload = { ...req.body };
  if (typeof payload.address === "string") payload.address = JSON.parse(payload.address);
  if (typeof payload.openingHours === "string") payload.openingHours = JSON.parse(payload.openingHours);
  if (typeof payload.location === "string") payload.location = JSON.parse(payload.location);
  if (typeof payload.facilities === "string") payload.facilities = JSON.parse(payload.facilities);
  if (typeof payload.phoneNumbers === "string") payload.phoneNumbers = JSON.parse(payload.phoneNumbers);

  if (req.files?.images?.length) {
    const newImages = req.files.images.map((file) => ({
      url: file.path,
      publicId: file.filename,
      alt: payload.branchName || branch.branchName,
    }));
    payload.images = [...branch.images, ...newImages];
  }

  if (req.files?.banner?.length) {
    if (branch.banner?.publicId) await deleteImage(branch.banner.publicId);
    payload.banner = { url: req.files.banner[0].path, publicId: req.files.banner[0].filename };
  }

  Object.assign(branch, payload);
  await branch.save();

  logActivity(req, {
    action: "update",
    entityType: "Branch",
    entityId: branch._id,
    description: `Updated branch "${branch.branchName}"`,
  });

  res.status(200).json(new ApiResponse(200, "Branch updated successfully", branch));
});

const removeBranchImage = asyncHandler(async (req, res) => {
  const branch = await Branch.findById(req.params.id);
  if (!branch) throw new ApiError(404, "Branch not found");

  const decodedPublicId = decodeURIComponent(req.params.publicId);
  const exists = branch.images.some((img) => img.publicId === decodedPublicId);
  if (!exists) throw new ApiError(404, "Image not found on this branch");

  await deleteImage(decodedPublicId);
  branch.images = branch.images.filter((img) => img.publicId !== decodedPublicId);
  await branch.save();

  res.status(200).json(new ApiResponse(200, "Image removed successfully", branch));
});

const deleteBranch = asyncHandler(async (req, res) => {
  const branch = await Branch.findById(req.params.id);
  if (!branch) throw new ApiError(404, "Branch not found");

  await Promise.all(branch.images.map((img) => deleteImage(img.publicId)));
  if (branch.banner?.publicId) await deleteImage(branch.banner.publicId);

  await branch.deleteOne();

  logActivity(req, {
    action: "delete",
    entityType: "Branch",
    entityId: branch._id,
    description: `Deleted branch "${branch.branchName}"`,
  });

  res.status(200).json(new ApiResponse(200, "Branch deleted successfully", null));
});

module.exports = {
  getAllBranches,
  getBranchById,
  getNearbyBranches,
  createBranch,
  updateBranch,
  removeBranchImage,
  deleteBranch,
};
