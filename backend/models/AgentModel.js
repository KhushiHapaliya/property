const mongoose = require("mongoose");

const agentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Agent name is required"],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
    },
    propertiesSold: {
      type: Number,
      default: 0,
    },
    propertiesUnder: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    officeAddress: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    picture: {
      type: String, // This will store the path to the image
      default: "images/default-agent.jpg",
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Agent = mongoose.model("Agent", agentSchema);

module.exports = Agent;