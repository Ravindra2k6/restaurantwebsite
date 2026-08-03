const mongoose = require("mongoose");
const slugify = require("slugify");

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
      maxlength: 150,
    },
    slug: { type: String, unique: true, index: true },
    department: {
      type: String,
      enum: ["kitchen", "service", "management", "delivery", "marketing", "other"],
      default: "other",
    },
    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
    },
    employmentType: {
      type: String,
      enum: ["full-time", "part-time", "internship", "contract"],
      default: "full-time",
    },
    description: {
      type: String,
      required: [true, "Job description is required"],
      trim: true,
    },
    responsibilities: [{ type: String, trim: true }],
    requirements: [{ type: String, trim: true }],
    salaryRange: {
      min: { type: Number, min: 0 },
      max: { type: Number, min: 0 },
    },
    isActive: { type: Boolean, default: true },
    applicationDeadline: { type: Date },
  },
  { timestamps: true }
);

jobSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = `${slugify(this.title, { lower: true, strict: true })}-${Date.now().toString().slice(-5)}`;
  }
  next();
});

module.exports = mongoose.model("Job", jobSchema);
