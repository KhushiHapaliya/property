const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  first_nm: {
    type: String,
    required: true,
    trim: true
  },
  last_nm: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  state: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  mobile: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  profilePic: {
    type: String,
    default: null
  },
  role: {
    type: String,
    enum: ["user", "agent", "admin"],
    default: "user"
  },
  status: {
    type: String,
    enum: ["Active", "Inactive", "Suspended"],
    default: "Inactive"
  },
  verificationToken: {
    type: String,
    default: null
  },
  resetPasswordToken: {
    type: String,
    default: null
  },
  resetPasswordExpires: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the 'updatedAt' field on save
UserSchema.pre("save", function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("User", UserSchema);