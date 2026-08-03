const mongoose = require("mongoose");

/**
 * IMPORTANT: This model stores ONLY reviews submitted directly on the website.
 * Google reviews are fetched live from the Google Business Profile API at
 * request-time (see controllers/googleReviewController.js) and are never
 * persisted here — this keeps the two review sources clearly separated,
 * as required by the project spec.
 */
const reviewSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: 80,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
    },
    title: { type: String, trim: true, maxlength: 120 },
    comment: {
      type: String,
      required: [true, "Review comment is required"],
      trim: true,
      maxlength: 1000,
    },
    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
    },
    avatar: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" },
    },
    source: {
      type: String,
      enum: ["website"],
      default: "website",
      immutable: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    isFeatured: { type: Boolean, default: false },
    adminReply: {
      message: { type: String, trim: true, maxlength: 500 },
      repliedAt: { type: Date },
    },
  },
  { timestamps: true }
);

reviewSchema.index({ status: 1, createdAt: -1 });
reviewSchema.index({ branch: 1 });

module.exports = mongoose.model("Review", reviewSchema);
