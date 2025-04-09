const express = require("express");
const router = express.Router();
const Appointment = require("../models/AppointmentModel");
const nodemailer = require("nodemailer");
const User = require("../models/User"); // Assuming you have a User model
const jwt = require("jsonwebtoken");

// Configuration for email service
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Middleware for protecting routes
const protect = async (req, res, next) => {
  try {
    // 1) Get token from Authorization header
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        status: "error",
        message: "You are not logged in. Please log in to get access.",
      });
    }

    // 2) Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({
        status: "error",
        message: "The user belonging to this token no longer exists.",
      });
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    next();
  } catch (error) {
    res.status(401).json({
      status: "error",
      message: "Invalid token or authorization error",
    });
  }
};

// Middleware for restricting access based on role
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: "error",
        message: "You do not have permission to perform this action",
      });
    }
    next();
  };
};

// Create a new appointment (public route)
router.post("/", async (req, res) => {
  try {
    const { name, email, date, time, message, property, user } = req.body;

    // Create appointment data object with required fields
    const appointmentData = {
      name,
      email,
      date,
      time,
      message: message || "",
    };

    // Only add property and user if they are valid values
    if (property) appointmentData.property = property;
    if (user) appointmentData.user = user;

    // Create new appointment
    const appointment = await Appointment.create(appointmentData);

    // Send confirmation email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Appointment Confirmation",
      html: `
        <h1>Appointment Confirmation</h1>
        <p>Dear ${name},</p>
        <p>Your appointment has been scheduled for ${new Date(date).toLocaleDateString()} at ${time}.</p>
        <p>Message: ${message || "No additional message"}</p>
        <p>We will contact you shortly to confirm the details.</p>
        <p>Thank you!</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({
      status: "success",
      data: {
        appointment,
      },
      message: "Appointment created successfully and confirmation email sent",
    });
  } catch (error) {
    console.error("Error creating appointment:", error);
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
});

// Get all appointments (protected admin route)
router.get("/", protect, restrictTo("admin"), async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("property", "title address")
      .populate("user", "name email");

    res.status(200).json({
      status: "success",
      results: appointments.length,
      data: {
        appointments,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
});

// Get user's appointments (protected user route)
router.get("/my-appointments", protect, async (req, res) => {
  try {
    // Get appointments where the user field matches the logged-in user's ID
    // or where the email matches the logged-in user's email
    const user = await User.findById(req.user.id);
    
    const appointments = await Appointment.find({
      $or: [
        { user: req.user.id },
        { email: user.email }
      ]
    }).populate("property", "title address images");

    res.status(200).json({
      status: "success",
      results: appointments.length,
      data: {
        appointments,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
});

// Get single appointment by ID
router.get("/:id", protect, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate("property", "title address")
      .populate("user", "name email");

    if (!appointment) {
      return res.status(404).json({
        status: "error",
        message: "Appointment not found",
      });
    }

    // Check if the user is authorized (admin or the user who created the appointment)
    if (
      req.user.role !== "admin" &&
      appointment.user &&
      appointment.user._id.toString() !== req.user.id &&
      appointment.email !== req.user.email
    ) {
      return res.status(403).json({
        status: "error",
        message: "You are not authorized to access this appointment",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        appointment,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
});

// Update appointment status (admin or user who created it)
router.patch("/:id", protect, async (req, res) => {
  try {
    const { status } = req.body;
    
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({
        status: "error",
        message: "Appointment not found",
      });
    }

    // Check if the user is authorized (admin or the user who created the appointment)
    if (
      req.user.role !== "admin" &&
      appointment.user &&
      appointment.user.toString() !== req.user.id &&
      appointment.email !== req.user.email
    ) {
      return res.status(403).json({
        status: "error",
        message: "You are not authorized to update this appointment",
      });
    }

    // Update only allowed fields
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    // Send email notification about status change
    if (status) {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: appointment.email,
        subject: `Appointment ${status.charAt(0).toUpperCase() + status.slice(1)}`,
        html: `
          <h1>Appointment Update</h1>
          <p>Dear ${appointment.name},</p>
          <p>Your appointment scheduled for ${new Date(appointment.date).toLocaleDateString()} at ${appointment.time} has been ${status}.</p>
          <p>Thank you for using our service!</p>
        `,
      };

      await transporter.sendMail(mailOptions);
    }

    res.status(200).json({
      status: "success",
      data: {
        appointment: updatedAppointment,
      },
      message: `Appointment ${status} successfully`,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
});

// Delete appointment (admin or user who created it)
router.delete("/:id", protect, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({
        status: "error",
        message: "Appointment not found",
      });
    }

    // Check if the user is authorized (admin or the user who created the appointment)
    if (
      req.user.role !== "admin" &&
      appointment.user &&
      appointment.user.toString() !== req.user.id &&
      appointment.email !== req.user.email
    ) {
      return res.status(403).json({
        status: "error",
        message: "You are not authorized to delete this appointment",
      });
    }

    await Appointment.findByIdAndDelete(req.params.id);

    res.status(200).json({
      status: "success",
      message: "Appointment deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
});

module.exports = router;