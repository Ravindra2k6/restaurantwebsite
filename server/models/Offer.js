const mongoose = require("mongoose");

const offerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Offer title is required"],
      trim: true,
      maxlength: 120,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    image: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" },
    },
    discountType: {
      type: String,
      enum: ["percentage", "flat", "bogo", "combo"],
      default: "percentage",
    },
    discountValue: {
      type: Number,
      min: 0,
      default: 0,
    },
    couponCode: {
      type: String,
      trim: true,
      uppercase: true,
      unique: true,
      sparse: true, // allows multiple docs without a coupon code
    },
    minOrderValue: { type: Number, min: 0, default: 0 },
    validFrom: { type: Date, default: Date.now },
    validUntil: { type: Date, required: [true, "Offer expiry date is required"] },
    applicableBranches: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Branch" },
    ], // empty = all branches
    isFestive: { type: Boolean, default: false },
    isBirthdayOffer: { type: Boolean, default: false },
    usageLimit: { type: Number, default: 0 }, // 0 = unlimited
    usedCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

offerSchema.virtual("isExpired").get(function () {
  return this.validUntil < new Date();
});

offerSchema.index({ isActive: 1, validUntil: 1 });

module.exports = mongoose.model("Offer", offerSchema);
