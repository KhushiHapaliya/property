const express = require("express");
const multer = require("multer");
const path = require("path");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt"); // Add this for password hashing
const router = express.Router();
const UserSchema = require("../models/User");
require("dotenv").config();

// Email Transporter Configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASS, // Your password or app password
  },
});

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images/profile_pictures"); // Save images here
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

// File Upload Middleware
const upload = multer({ storage: storage });

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid or expired token" });
  }
};

// Insert data into MongoDB
router.post("/add-user", upload.single("profilePic"), async (req, res) => {
  try {
    const {
      first_nm,
      last_nm,
      address,
      city,
      state,
      email,
      mobile,
      password,
      role,
    } = req.body;

    // Validate required fields
    if (!first_nm || !last_nm || !address || !city || !state || !email || !mobile || !password) {
      return res
        .status(400)
        .json({ error: "All required fields must be provided." });
    }

    // Generate Verification Token
    const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Check if email already exists
    const existingUser = await UserSchema.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email is already registered" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = new UserSchema({
      first_nm,
      last_nm,
      address,
      city,
      state,
      email,
      mobile,
      password: hashedPassword, // Store hashed password
      profilePic: req.file ? req.file.filename : null, // Use req.file for uploaded profile picture
      role: role || "user",
      status: "Inactive", 
      verificationToken,
      // Default status
    });

    // Save user to database
    await newUser.save();

    // Send Verification Email
    const verificationLink = `http://localhost:5000/api/User/verify-email/${verificationToken}`;
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify Your Email",
      html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
         <h2 style="color: #333; text-align: center;">Welcome to Our Platform, ${first_nm}!</h2>
         
         <p style="color: #555; font-size: 16px;">
           Thank you for signing up! Please verify your email to activate your account.
         </p>
     
         <div style="text-align: center; margin: 20px 0;">
           <a href="${verificationLink}" 
              style="display: inline-block; padding: 12px 20px; background-color: #007bff; color: #fff; 
                     text-decoration: none; font-size: 16px; border-radius: 5px;">
           Verify Your Email
           </a>
         </div>
<p style="color: #777; font-size: 14px;">
        If you did not sign up, you can safely ignore this email. This verification link will expire in 24 hours.
      </p>
  
      <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
  
      <p style="text-align: center; color: #666; font-size: 14px;">
        Regards, <br> <strong>Real Estate Team</strong>
      </p>
    </div>
  `,
    });
    
    res.status(201).json({message : "User added successfully! Please check your email to verify your account.", user : newUser});
  } catch (error) {
    console.error("User registration error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Email Verification Route
router.get("/verify-email/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UserSchema.findOne({ email: decoded.email, verificationToken: token });

    if (!user) {
      return res.redirect(
        "http://localhost:5173/login?status=error&message=Invalid or expired token."
      );
    }

    user.status = "Active";
    user.verificationToken = null;
    await user.save();

    return res.redirect(
      "http://localhost:5173/login?status=success&message=Email verified successfully! You can now log in."
    );
  } catch (error) {
    console.error("Verification error:", error);
    return res.redirect(
      "http://localhost:5173/login?status=error&message=Verification failed or token expired."
    );
  }
});

// Login Route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate inputs
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required", status: "error" });
    }

    // Find user by email
    const user = await UserSchema.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password", status: "error" });
    }

    // Check if user is active
    if (user.status !== "Active") {
      return res.status(401).json({ 
        message: "Account not verified. Please check your email for verification link.", 
        status: "error" 
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password", status: "error" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Return user info and token (excluding password)
    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.verificationToken;

    res.status(200).json({
      message: "Login successful",
      status: "success",
      token,
      user: userResponse
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "An error occurred during login", status: "error" });
  }
});

// Request password reset
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await UserSchema.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ message: "User not found", status: "error" });
    }
    
    // Generate reset token
    const resetToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1h" });
    
    // Save reset token to user
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();
    
    // Send reset email with corrected link to frontend route
    const resetLink = `http://localhost:5173/reset-password/${resetToken}`;
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset Request",
      html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
        <h2 style="color: #333; text-align: center;">Password Reset Request</h2>
        
        <p style="color: #555; font-size: 16px;">
          You requested a password reset. Please click the button below to reset your password.
        </p>
    
        <div style="text-align: center; margin: 20px 0;">
          <a href="${resetLink}" 
             style="display: inline-block; padding: 12px 20px; background-color: #007bff; color: #fff; 
                    text-decoration: none; font-size: 16px; border-radius: 5px;">
          Reset Password
          </a>
        </div>
        
        <p style="color: #777; font-size: 14px;">
          If you did not request a password reset, please ignore this email. This link will expire in 1 hour.
        </p>

        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">

        <p style="text-align: center; color: #666; font-size: 14px;">
          Regards, <br> <strong>Real Estate Team</strong>
        </p>
      </div>`
    });
    
    res.status(200).json({ message: "Password reset link sent to your email", status: "success" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Server error", status: "error" });
  }
});

// Reset password
router.post("/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UserSchema.findOne({ 
      email: decoded.email,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token", status: "error" });
    }
    
    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    
    res.status(200).json({ message: "Password has been reset successfully", status: "success" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Server error", status: "error" });
  }
});

// Get user profile (protected route)
router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const user = await UserSchema.findById(req.user.id).select("-password -verificationToken -resetPasswordToken -resetPasswordExpires");
    if (!user) {
      return res.status(404).json({ message: "User not found", status: "error" });
    }
    res.json(user);
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({ message: "Server error", status: "error" });
  }
});

module.exports = router;