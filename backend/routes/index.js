const express = require("express");
const router = express.Router();
const userRoutes = require("./userRoutes"); // User-related routes
const propertyRoutes = require("./propertyRoutes"); // Property-related routes
const appointmentRoutes = require("./appointmentRoutes"); // Appointment routes
const agentRoutes = require("./agentRoutes"); // Agent routes

// Use the routes
router.use("/user", userRoutes);
router.use("/properties", propertyRoutes); // Property routes with /api/properties prefix
router.use("/appointments", appointmentRoutes); // Appointment routes with /api/appointments prefix
router.use("/agents", agentRoutes); // Agent routes with /api/agents prefix

// Handle 404 errors for unknown routes
router.use((req, res) => {
  res.status(404).json({ error: "Route not found." });
});

module.exports = router;