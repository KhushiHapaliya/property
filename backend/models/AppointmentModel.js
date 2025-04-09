const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email address is required"],
      trim: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, "Please enter a valid email address"],
    },
    date: {
      type: Date,
      required: [true, "Appointment date is required"],
    },
    time: {
      type: String,
      required: [true, "Appointment time is required"],
    },
    message: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },
    // Optional: Reference to property if this appointment is for viewing a property
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
    },
    // Optional: Reference to user (if the user is logged in)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Appointment = mongoose.model("Appointment", appointmentSchema);

module.exports = Appointment;