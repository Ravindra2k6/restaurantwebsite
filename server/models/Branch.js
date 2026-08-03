const mongoose = require("mongoose");
const slugify = require("slugify");

const openingHourSchema = new mongoose.Schema(
  {
    day: {
      type: String,
      enum: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
      required: true,
    },
    open: { type: String, default: "" }, // "10:00" — empty means closed that day
    close: { type: String, default: "" },
    isClosed: { type: Boolean, default: false },
  },
  { _id: false }
);

const branchSchema = new mongoose.Schema(
  {
    restaurantName: {
      type: String,
      required: [true, "Restaurant name is required"],
      trim: true,
    },
    branchName: {
      type: String,
      required: [true, "Branch name is required"],
      trim: true,
    },
    slug: { type: String, unique: true, index: true },
    address: {
      line1: { type: String, required: [true, "Address is required"], trim: true },
      area: { type: String, trim: true },
      city: { type: String, required: true, trim: true },
      state: { type: String, trim: true },
      country: { type: String, trim: true, default: "India" },
      postalCode: { type: String, trim: true },
    },
    phoneNumbers: [{ type: String, trim: true }],
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    openingHours: {
      type: [openingHourSchema],
      default: [],
    },
    googleMapsEmbedUrl: { type: String, trim: true },
    location: {
      // GeoJSON point — enables geospatial "nearest branch" queries
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        default: [0, 0],
      },
    },
    managerName: { type: String, trim: true },
    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String, required: true },
        alt: { type: String, default: "" },
      },
    ],
    banner: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" },
    },
    parkingAvailable: { type: Boolean, default: false },
    facilities: [{ type: String, trim: true }], // e.g. AC, Rooftop, Live Music, Wheelchair Access
    deliveryAvailable: { type: Boolean, default: true },
    reservationAvailable: { type: Boolean, default: true },
    averageCostForTwo: { type: Number, min: 0 },
    googlePlaceId: { type: String, trim: true }, // used for Google Business Profile integration
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

branchSchema.pre("save", function (next) {
  if (this.isModified("branchName") || this.isModified("restaurantName")) {
    this.slug = slugify(`${this.restaurantName}-${this.branchName}`, { lower: true, strict: true });
  }
  next();
});

branchSchema.index({ location: "2dsphere" });
branchSchema.index({ "address.city": 1 });

module.exports = mongoose.model("Branch", branchSchema);
