import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";

const Appointment = () => {
  const navigate = useNavigate();
  const { propertyId } = useParams(); // Get property ID from URL if available
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [property, setProperty] = useState(null);
  
  // Get user info from localStorage if logged in
  const getUserFromLocalStorage = () => {
    const userString = localStorage.getItem("user");
    return userString ? JSON.parse(userString) : null;
  };
  
  const currentUser = getUserFromLocalStorage();
  
  const [formData, setFormData] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    date: "",
    time: "",
    message: "",
    property: propertyId || null, // Changed from empty string to null
    user: currentUser?._id || null, // Changed from empty string to null
  });

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  // Fetch property details if propertyId is available
  useEffect(() => {
    const fetchPropertyDetails = async () => {
      if (propertyId) {
        try {
          const response = await axios.get(`/api/properties/${propertyId}`);
          setProperty(response.data.data.property);
          // Update formData with propertyId
          setFormData(prevData => ({
            ...prevData,
            property: propertyId
          }));
        } catch (error) {
          console.error("Error fetching property details:", error);
        }
      }
    };

    fetchPropertyDetails();
  }, [propertyId]);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // Clear error on user input
    // Reset submit messages
    setSubmitError("");
    setSubmitSuccess("");
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      
      // Create a copy of formData for submission
      const submissionData = {...formData};
      
      // Remove empty/null values for property and user
      if (!submissionData.property) delete submissionData.property;
      if (!submissionData.user) delete submissionData.user;
      
      try {
        const response = await axios.post("http://localhost:5000/api/appointments", submissionData);
        setSubmitSuccess("Appointment booked successfully! Check your email for confirmation.");
        
        // Reset form (except name and email if user is logged in)
        setFormData({
          ...formData,
          date: "",
          time: "",
          message: "",
        });
        
        // Redirect after a delay
        setTimeout(() => {
          if (propertyId) {
            navigate(`/properties/${propertyId}`);
          } else {
            navigate("/");
          }
        }, 3000);
      } catch (error) {
        console.error("Error booking appointment:", error);
        setSubmitError(
          error.response?.data?.message || 
          "Failed to book appointment. Please try again."
        );
      } finally {
        setLoading(false);
      }
    }
  };

  // Min date should be today
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="container my-5 d-flex justify-content-center">
      <div className="card shadow-lg p-4" style={{ maxWidth: "500px", width: "100%" }}>
        <h2 className="text-center mb-4">Book an Appointment</h2>
        
        {/* Property Info (if available) */}
        {property && (
          <div className="mb-4 text-center">
            <h5>{property.title}</h5>
            <p className="text-muted">{property.address}</p>
            {property.images && property.images.length > 0 && (
              <img 
                src={`/uploads/properties/${property.images[0]}`} 
                alt={property.title}
                className="img-thumbnail mb-3"
                style={{ maxHeight: "150px" }}
              />
            )}
          </div>
        )}
        
        {/* Success/Error Messages */}
        {submitSuccess && (
          <div className="alert alert-success text-center mb-4">{submitSuccess}</div>
        )}
        {submitError && (
          <div className="alert alert-danger text-center mb-4">{submitError}</div>
        )}
        
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
                min={today}
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
              placeholder="Additional information about your visit..."
            ></textarea>
          </div>

          {/* Buttons */}
          <div className="text-center">
            <button 
              type="submit" 
              className="btn btn-lg text-white" 
              style={{ backgroundColor: "#003f3f" }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Processing...
                </>
              ) : (
                <>
                  <i className="bi bi-check2-circle me-2"></i> Confirm Appointment
                </>
              )}
            </button>
            <button 
              type="button" 
              className="btn btn-secondary ms-3" 
              onClick={() => propertyId ? navigate(`/properties/${propertyId}`) : navigate("/")}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Appointment;