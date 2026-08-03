const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const User = require("../models/User");
const { deleteImage } = require("../config/cloudinary");
const logActivity = require("../utils/logActivity");

/**
 * @desc    List all staff/admin accounts ("Manage Staff")
 * @route   GET /api/v1/users
 * @access  Private (superadmin, admin)
 */
const getAllUsers = asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
  const skip = (page - 1) * limit;

  const filter = {};
  if (req.query.role) filter.role = req.query.role;
  if (req.query.branch) filter.branch = req.query.branch;
  if (req.query.search) {
    filter.$or = [
      { name: { $regex: req.query.search, $options: "i" } },
      { email: { $regex: req.query.search, $options: "i" } },
    ];
  }

  const [users, total] = await Promise.all([
    User.find(filter).sort("-createdAt").skip(skip).limit(limit).populate("branch", "branchName"),
    User.countDocuments(filter),
  ]);

  res.status(200).json(
    new ApiResponse(200, "Fetched staff accounts", users, {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    })
  );
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).populate("branch", "branchName");
  if (!user) throw new ApiError(404, "User not found");
  res.status(200).json(new ApiResponse(200, "Fetched user", user));
});

/**
 * @desc    Update a staff member's profile/role (not password — see authController)
 * @route   PATCH /api/v1/users/:id
 * @access  Private (superadmin, admin)
 */
const updateUser = asyncHandler(async (req, res) => {
  const { name, role, branch, isActive } = req.body;

  if (role === "superadmin" && req.user.role !== "superadmin") {
    throw new ApiError(403, "Only a superadmin can assign the superadmin role");
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { name, role, branch, isActive },
    { new: true, runValidators: true }
  );

  if (!user) throw new ApiError(404, "User not found");

  logActivity(req, {
    action: "update",
    entityType: "User",
    entityId: user._id,
    description: `Updated staff account "${user.name}"`,
  });

  res.status(200).json(new ApiResponse(200, "User updated successfully", user));
});

/**
 * @desc    Delete/deactivate a staff account
 * @route   DELETE /api/v1/users/:id
 * @access  Private (superadmin only)
 */
const deleteUser = asyncHandler(async (req, res) => {
  if (req.params.id === req.user.id) {
    throw new ApiError(400, "You cannot delete your own account while logged in");
  }

  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) throw new ApiError(404, "User not found");

  if (user.avatar?.publicId) await deleteImage(user.avatar.publicId);

  logActivity(req, {
    action: "delete",
    entityType: "User",
    entityId: user._id,
    description: `Deleted staff account "${user.name}"`,
  });

  res.status(200).json(new ApiResponse(200, "User deleted successfully", null));
});

/**
 * @desc    Upload/replace the logged-in user's avatar
 * @route   PATCH /api/v1/users/me/avatar
 * @access  Private
 */
const updateMyAvatar = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, "No image file uploaded");

  const user = await User.findById(req.user.id);
  if (user.avatar?.publicId) await deleteImage(user.avatar.publicId);

  user.avatar = { url: req.file.path, publicId: req.file.filename };
  await user.save({ validateBeforeSave: false });

  res.status(200).json(new ApiResponse(200, "Avatar updated successfully", user.toSafeObject()));
});

module.exports = { getAllUsers, getUserById, updateUser, deleteUser, updateMyAvatar };
