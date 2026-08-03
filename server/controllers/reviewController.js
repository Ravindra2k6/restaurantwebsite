const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const Review = require("../models/Review");
const logActivity = require("../utils/logActivity");

/**
 * @desc    Public list of APPROVED website reviews only
 * @route   GET /api/v1/reviews
 * @access  Public
 */
const getApprovedReviews = asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit, 10) || 10, 50);
  const skip = (page - 1) * limit;

  const filter = { status: "approved" };
  if (req.query.branch) filter.branch = req.query.branch;
  if (req.query.featured === "true") filter.isFeatured = true;
  if (req.query.minRating) filter.rating = { $gte: Number(req.query.minRating) };

  const [reviews, total, avgResult] = await Promise.all([
    Review.find(filter).sort("-createdAt").skip(skip).limit(limit),
    Review.countDocuments(filter),
    Review.aggregate([
      { $match: { status: "approved" } },
      { $group: { _id: null, avgRating: { $avg: "$rating" }, count: { $sum: 1 } } },
    ]),
  ]);

  res.status(200).json(
    new ApiResponse(200, "Fetched reviews", reviews, {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
      averageRating: avgResult[0]?.avgRating ? Number(avgResult[0].avgRating.toFixed(1)) : 0,
      totalApproved: avgResult[0]?.count || 0,
    })
  );
});

/**
 * @desc    Submit a new review from the public site (defaults to "pending")
 * @route   POST /api/v1/reviews
 * @access  Public
 */
const submitReview = asyncHandler(async (req, res) => {
  const payload = { ...req.body, status: "pending" };
  if (req.file) payload.avatar = { url: req.file.path, publicId: req.file.filename };

  const review = await Review.create(payload);
  res
    .status(201)
    .json(new ApiResponse(201, "Thank you! Your review has been submitted and is pending approval", review));
});

/**
 * @desc    Admin: list all reviews regardless of status
 * @route   GET /api/v1/reviews/admin
 * @access  Private (admin/manager)
 */
const getAllReviewsAdmin = asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
  const skip = (page - 1) * limit;

  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  if (req.query.branch) filter.branch = req.query.branch;

  const [reviews, total] = await Promise.all([
    Review.find(filter).sort("-createdAt").skip(skip).limit(limit).populate("branch", "branchName"),
    Review.countDocuments(filter),
  ]);

  res.status(200).json(
    new ApiResponse(200, "Fetched all reviews", reviews, {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    })
  );
});

/**
 * @desc    Admin: approve, reject, feature or reply to a review
 * @route   PATCH /api/v1/reviews/:id/moderate
 * @access  Private (admin/manager)
 */
const moderateReview = asyncHandler(async (req, res) => {
  const { status, isFeatured, adminReplyMessage } = req.body;

  const review = await Review.findById(req.params.id);
  if (!review) throw new ApiError(404, "Review not found");

  if (status) review.status = status;
  if (isFeatured !== undefined) review.isFeatured = isFeatured;
  if (adminReplyMessage) {
    review.adminReply = { message: adminReplyMessage, repliedAt: new Date() };
  }

  await review.save();

  logActivity(req, {
    action: "moderate",
    entityType: "Review",
    entityId: review._id,
    description: `Review by "${review.name}" set to "${review.status}"${isFeatured !== undefined ? ", featured: " + isFeatured : ""}`,
  });

  res.status(200).json(new ApiResponse(200, "Review updated successfully", review));
});

const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findByIdAndDelete(req.params.id);
  if (!review) throw new ApiError(404, "Review not found");

  logActivity(req, {
    action: "delete",
    entityType: "Review",
    entityId: review._id,
    description: `Deleted review by "${review.name}"`,
  });

  res.status(200).json(new ApiResponse(200, "Review deleted successfully", null));
});

module.exports = {
  getApprovedReviews,
  submitReview,
  getAllReviewsAdmin,
  moderateReview,
  deleteReview,
};
