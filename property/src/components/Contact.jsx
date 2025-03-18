import React, { useState } from "react";
import { FaMapMarkerAlt, FaClock, FaEnvelope, FaPhone } from "react-icons/fa";
import house2 from "./images/house2.jpg"; // Ensure this image exists

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let tempErrors = {};

    if (!formData.name.trim()) tempErrors.name = "Name is required.";
    if (!formData.email.trim()) tempErrors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      tempErrors.email = "Invalid email format.";
    if (!formData.subject.trim()) tempErrors.subject = "Subject is required.";
    if (!formData.message.trim()) tempErrors.message = "Message is required.";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      alert("Message Sent Successfully!");
      setFormData({ name: "", email: "", subject: "", message: "" });
      setErrors({});
    }
  };

  return (
    <>
      {/* Hero Section */}
      <div
        className="hero-section"
        style={{
          backgroundImage: `url(${house2})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div
          className="hero-overlay text-white text-center py-5"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <p>Home / Contact</p>
        </div>
      </div>

      {/* Contact Section */}
      <div className="container py-5">
        <div className="row">
          {/* Left Section: Contact Info */}
          <div className="col-md-5">
            <ContactInfo icon={<FaMapMarkerAlt className="fs-3" style={{ color: "#003f3f" }} />} title="Location:" text="43 Raymouth Rd, Baltemoer, London 3910" />
            <ContactInfo icon={<FaClock className="fs-3" style={{ color: "#003f3f" }} />} title="Open Hours:" text="Sunday-Friday: 11:00 AM - 11:00 PM" />
            <ContactInfo icon={<FaEnvelope className="fs-3" style={{ color: "#003f3f" }} />} title="Email:" text="info@Untree.co" />
            <ContactInfo icon={<FaPhone className="fs-3" style={{ color: "#003f3f" }} />} title="Call:" text="+1 1234 55488 55" />
          </div>

          {/* Right Section: Contact Form */}
          <div className="col-md-7">
            <div className="card shadow p-4">
              <form onSubmit={handleSubmit}>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <input type="text" name="name" className="form-control" placeholder="Your Name" value={formData.name} onChange={handleChange} />
                    {errors.name && <div className="text-danger small">{errors.name}</div>}
                  </div>
                  <div className="col-md-6">
                    <input type="email" name="email" className="form-control" placeholder="Your Email" value={formData.email} onChange={handleChange} />
                    {errors.email && <div className="text-danger small">{errors.email}</div>}
                  </div>
                </div>

                <div className="mb-3">
                  <input type="text" name="subject" className="form-control" placeholder="Subject" value={formData.subject} onChange={handleChange} />
                  {errors.subject && <div className="text-danger small">{errors.subject}</div>}
                </div>

                <div className="mb-3">
                  <textarea name="message" className="form-control" rows="5" placeholder="Message" value={formData.message} onChange={handleChange} />
                  {errors.message && <div className="text-danger small">{errors.message}</div>}
                </div>

                <button type="submit" className="btn w-100" style={{ backgroundColor: "#003f3f", color: "#fff" }}>
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Contact Info Component
const ContactInfo = ({ icon, title, text }) => (
  <div className="d-flex align-items-center mb-3">
    <div className="me-3 p-3 bg-light rounded-circle">{icon}</div>
    <div>
      <h5 className="mb-1 fw-bold">{title}</h5>
      <p className="mb-0">{text}</p>
    </div>
  </div>
);

export default Contact;
