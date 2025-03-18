import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Appointment = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    date: "",
    time: "",
    message: "",
  });

  const [errors, setErrors] = useState({}); // Stores validation errors

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // Clear error on user input
  };

  // Validate form data
  const validateForm = () => {
    let newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Full Name is required.";
    if (!formData.email.trim()) {
      newErrors.email = "Email Address is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format.";
    }
    if (!formData.date) newErrors.date = "Please select a date.";
    if (!formData.time) newErrors.time = "Please select a time.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      alert("Appointment booked successfully!");
      navigate("/"); // Redirect back to home or property details
    }
  };

  return (
    <div className="container my-5 d-flex justify-content-center">
      <div className="card shadow-lg p-4" style={{ maxWidth: "500px", width: "100%" }}>
        <h2 className="text-center mb-4">Book an Appointment</h2>
        <form onSubmit={handleSubmit}>
          
          {/* Full Name Field */}
          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className={`form-control ${errors.name ? "border-danger" : ""}`}
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && <small className="text-danger">{errors.name}</small>}
          </div>

          {/* Email Field */}
          <div className="mb-3">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className={`form-control ${errors.email ? "border-danger" : ""}`}
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <small className="text-danger">{errors.email}</small>}
          </div>

          {/* Date & Time Fields */}
          <div className="mb-3 row">
            <div className="col-6">
              <label className="form-label">Date</label>
              <input
                type="date"
                className={`form-control ${errors.date ? "border-danger" : ""}`}
                name="date"
                value={formData.date}
                onChange={handleChange}
              />
              {errors.date && <small className="text-danger">{errors.date}</small>}
            </div>
            <div className="col-6">
              <label className="form-label">Time</label>
              <input
                type="time"
                className={`form-control ${errors.time ? "border-danger" : ""}`}
                name="time"
                value={formData.time}
                onChange={handleChange}
              />
              {errors.time && <small className="text-danger">{errors.time}</small>}
            </div>
          </div>

          {/* Message Field (Optional) */}
          <div className="mb-3">
            <label className="form-label">Message (Optional)</label>
            <textarea
              className="form-control"
              rows="3"
              name="message"
              value={formData.message}
              onChange={handleChange}
            ></textarea>
          </div>

          {/* Buttons */}
          <div className="text-center">
            <button type="submit" className="btn btn-lg text-white" style={{ backgroundColor: "#003f3f" }}>
              <i className="bi bi-check2-circle me-2"></i> Confirm Appointment
            </button>
            <button type="button" className="btn btn-secondary ms-3" onClick={() => navigate("/")}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Appointment;
