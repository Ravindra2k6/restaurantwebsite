const mongoose = require("mongoose");

const jobApplicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    phone: { type: String, required: true, trim: true },
    resumeUrl: { type: String, required: true }, // Cloudinary raw/pdf upload
    resumePublicId: { type: String, required: true },
    coverNote: { type: String, trim: true, maxlength: 1000 },
    status: {
      type: String,
      enum: ["received", "reviewing", "shortlisted", "rejected", "hired"],
      default: "received",
    },
  },
  { timestamps: true }
);

jobApplicationSchema.index({ job: 1, status: 1 });

module.exports = mongoose.model("JobApplication", jobApplicationSchema);
