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

// Serve static files (for profile pictures, etc.)
app.use("/public", express.static(path.join(__dirname, "public")));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((error) => console.error("❌ MongoDB Connection Error:", error));

// Create public directories if they don't exist
const fs = require('fs');
const publicDir = path.join(__dirname, 'public');
const imagesDir = path.join(publicDir, 'images');
const profilePicsDir = path.join(imagesDir, 'profile_pictures');

// Create directories if they don't exist
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir);
}
if (!fs.existsSync(profilePicsDir)) {
  fs.mkdirSync(profilePicsDir);
}

// Import Main Router
const mainRouter = require("./routes/index.js");
app.use("/api", mainRouter); // All routes will be prefixed with `/api`

// Default Route
app.use((req, res) => {
  res.status(404).json({ error: "Route not found." });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));