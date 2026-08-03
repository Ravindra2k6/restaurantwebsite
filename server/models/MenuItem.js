const mongoose = require("mongoose");
const slugify = require("slugify");

const priceVariantSchema = new mongoose.Schema(
  {
    label: { type: String, required: true, trim: true }, // e.g. "Half", "Full", "Regular"
    price: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const menuItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Dish name is required"],
      trim: true,
      maxlength: [120, "Name cannot exceed 120 characters"],
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
      default: "",
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },
    foodType: {
      type: String,
      enum: ["veg", "non-veg", "egg"],
      required: [true, "Food type is required"],
    },
    // Simple single price OR multiple variants (Half/Full) — at least one required
    price: {
      type: Number,
      min: 0,
      default: null,
    },
    variants: {
      type: [priceVariantSchema],
      default: [],
    },
    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String, required: true },
        alt: { type: String, default: "" },
      },
    ],
    isAvailable: {
      type: Boolean,
      default: true,
    },
    isTodaysSpecial: {
      type: Boolean,
      default: false,
    },
    isPopular: {
      type: Boolean,
      default: false,
    },
    isChefRecommended: {
      type: Boolean,
      default: false,
    },
    spiceLevel: {
      type: String,
      enum: ["mild", "medium", "hot", "extra-hot", "none"],
      default: "none",
    },
    tags: [{ type: String, trim: true, lowercase: true }],
    branches: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Branch",
      },
    ], // empty array = available at all branches
    calories: { type: Number, min: 0 },
    preparationTimeMinutes: { type: Number, min: 0 },
    displayOrder: { type: Number, default: 0 },
    seo: {
      metaTitle: { type: String, trim: true },
      metaDescription: { type: String, trim: true, maxlength: 160 },
    },
  },
  { timestamps: true }
);

menuItemSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = `${slugify(this.name, { lower: true, strict: true })}-${Date.now().toString().slice(-5)}`;
  }
  if (!this.price && (!this.variants || this.variants.length === 0)) {
    return next(new Error("Either a flat price or at least one price variant is required"));
  }
  next();
});

menuItemSchema.index({ name: "text", description: "text", tags: "text" });
menuItemSchema.index({ category: 1, isAvailable: 1 });
menuItemSchema.index({ foodType: 1 });

module.exports = mongoose.model("MenuItem", menuItemSchema);
