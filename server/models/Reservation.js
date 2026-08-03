const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema(
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
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: [true, "Branch is required"],
    },
    partySize: {
      type: Number,
      required: [true, "Number of guests is required"],
      min: [1, "Party size must be at least 1"],
      max: [50, "For groups over 50, please contact the branch directly"],
    },
    reservationDate: {
      type: Date,
      required: [true, "Reservation date is required"],
    },
    reservationTime: {
      type: String, // "19:30"
      required: [true, "Reservation time is required"],
    },
    occasion: {
      type: String,
      enum: ["none", "birthday", "anniversary", "business", "date", "family", "other"],
      default: "none",
    },
    specialRequest: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "seated", "completed", "cancelled", "no-show"],
      default: "pending",
    },
    confirmedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    tableNumber: { type: String, trim: true },
  },
  { timestamps: true }
);

reservationSchema.index({ branch: 1, reservationDate: 1 });
reservationSchema.index({ status: 1 });

module.exports = mongoose.model("Reservation", reservationSchema);
