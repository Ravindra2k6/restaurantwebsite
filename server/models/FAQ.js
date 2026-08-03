const mongoose = require("mongoose");

const faqSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, "Question is required"],
      trim: true,
      maxlength: 300,
    },
    answer: {
      type: String,
      required: [true, "Answer is required"],
      trim: true,
      maxlength: 1000,
    },
    category: {
      type: String,
      enum: ["general", "reservation", "delivery", "menu", "careers", "payments", "other"],
      default: "general",
    },
    displayOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

faqSchema.index({ category: 1, displayOrder: 1 });

module.exports = mongoose.model("FAQ", faqSchema);
