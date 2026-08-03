const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema(
  {
    title: { type: String, trim: true, maxlength: 120 },
    caption: { type: String, trim: true, maxlength: 300 },
    category: {
      type: String,
      enum: ["food", "ambience", "events", "staff", "awards", "other"],
      default: "other",
    },
    image: {
      url: { type: String, required: true },
      publicId: { type: String, required: true },
      alt: { type: String, default: "" },
    },
    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      default: null,
    },
    isFeatured: { type: Boolean, default: false },
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

gallerySchema.index({ category: 1 });

module.exports = mongoose.model("Gallery", gallerySchema);
