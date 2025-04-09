const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON requests
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded requests

// // Serve static files (for profile pictures, etc.)
// app.use("/public", express.static(path.join(__dirname, "public")));

// Serve profile pictures and other static images
app.use("/images", express.static(path.join(__dirname, "public/images")));

// Serve property images and other uploads
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

// Create required directories
const fs = require('fs');
const publicDir = path.join(__dirname, 'public');
const imagesDir = path.join(publicDir, 'images');
const profilePicsDir = path.join(imagesDir, 'profile_pictures');
const uploadsDir = path.join(publicDir, 'uploads');
const propertyImagesDir = path.join(uploadsDir, 'properties');

// Create directories if they don't exist
const dirs = [publicDir, imagesDir, profilePicsDir, uploadsDir, propertyImagesDir];
dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("✅ Connected to MongoDB at:", process.env.MONGO_URI);
    // Log available models for debugging
    console.log("Available models:", Object.keys(mongoose.models));
  })
  .catch((error) => {
    console.error("❌ MongoDB Connection Error:", error);
    // More detailed error info
    console.error("Check that your MongoDB server is running");
    console.error("DB URI:", process.env.MONGO_URI);
  });

// Import Main Router
const mainRouter = require("./routes/index.js");
app.use("/api", mainRouter); // All routes will be prefixed with `/api`

// For React frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build/index.html'));
  });
}

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📂 API available at http://localhost:${PORT}/api`);
});