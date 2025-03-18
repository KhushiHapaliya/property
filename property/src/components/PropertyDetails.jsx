import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import house1 from "./images/house1.jpg";
import house2 from "./images/house2.jpg";
import house3 from "./images/house3.jpg";
import agent from "./images/agent.jpg";
import img1 from "./images/img1.jpg";

const property = {
  title: "Luxury Apartment in NYC",
  description: "A beautiful 3BHK apartment with modern amenities.",
  price: 500000,
  property_type: "Apartment",
  status: "Available",
  bedrooms: 3,
  bathrooms: 2,
  size_sqft: 1500,
  rating: 4, // Rating out of 5
  location: {
    address: "123 Street, New York, NY",
    city: "New York",
    state: "NY",
    zip_code: "10001",
    country: "USA",
  },
};

const PropertyDetails = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", review: "", rating: 0 });
  const [errors, setErrors] = useState({});

  const validate = () => {
    let newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email";
    }
    if (!formData.review.trim()) newErrors.review = "Review is required";
    if (formData.rating === 0) newErrors.rating = "Please select a rating";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      alert("Review submitted successfully!");
      setFormData({ name: "", email: "", review: "", rating: 0 });
    }
  };


  return (
    <>
      {/* Hero Section */}
      <div className="position-relative text-center text-white" style={{ height: "300px", background: `url(${img1}) center/cover no-repeat` }}>
        <div className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center bg-dark bg-opacity-50">
          <h1 className="fw-bold">{property.title}</h1>
          <p>Home / Properties / {property.location.city}, {property.location.state}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container my-5">
        <div className="row g-4 align-items-center">
          {/* Left Side - Image Carousel */}
          <div className="col-md-6">
            <div id="propertyCarousel" className="carousel slide" data-bs-ride="carousel">
              <div className="carousel-inner">
                <div className="carousel-item active">
                  <img src={house1} className="d-block w-100 rounded" alt="Property 1" />
                </div>
                <div className="carousel-item">
                  <img src={house2} className="d-block w-100 rounded" alt="Property 2" />
                </div>
                <div className="carousel-item">
                  <img src={house3} className="d-block w-100 rounded" alt="Property 3" />
                </div>
              </div>
              <button className="carousel-control-prev" type="button" data-bs-target="#propertyCarousel" data-bs-slide="prev">
                <span className="carousel-control-prev-icon"></span>
              </button>
              <button className="carousel-control-next" type="button" data-bs-target="#propertyCarousel" data-bs-slide="next">
                <span className="carousel-control-next-icon"></span>
              </button>
            </div>
          </div>

          {/* Right Side - Property Details */}
          <div className="col-md-6">
            <h2 className="fw-bold">{property.title}</h2>
            <p className="text-muted">
              <i className="bi bi-geo-alt me-2"></i> {property.location.address}, {property.location.city}, {property.location.state}, {property.location.zip_code}
            </p>

            {/* Star Rating (Plain, No Color, Larger Size) */}
            <div className="mb-3">
              {[...Array(5)].map((_, index) => (
                <i
                  key={index}
                  className={`bi ${index < property.rating ? "bi-star-fill" : "bi-star"} fs-3`}
                ></i>
              ))}
            </div>

            <h4 className="text-success fw-bold">${property.price.toLocaleString()}</h4>
            <span className={`badge ${property.status === "Available" ? "bg-success" : "bg-danger"}`}>{property.status}</span>

            <div className="row my-4">
              <div className="col-md-6">
                <p className="fw-bold">
                  <i className="bi bi-building me-2"></i> Property Type: <span className="text-primary">{property.property_type}</span>
                </p>
              </div>
              <div className="col-md-6">
                <p className="fw-bold">
                  <i className="bi bi-house-door me-2"></i> Status: <span className="text-success">{property.status}</span>
                </p>
              </div>
              <div className="col-md-6">
                <p className="fw-bold">
                  <i className="bi bi-bed me-2"></i> Bedrooms: <span className="text-dark">{property.bedrooms}</span>
                </p>
              </div>
              <div className="col-md-6">
                <p className="fw-bold">
                  <i className="bi bi-bathtub me-2"></i> Bathrooms: <span className="text-dark">{property.bathrooms}</span>
                </p>
              </div>
              <div className="col-md-6">
                <p className="fw-bold">
                  <i className="bi bi-rulers me-2"></i> Size: <span className="text-dark">{property.size_sqft} sqft</span>
                </p>
              </div>
            </div>

            <p>{property.description}</p>

            {/* Book Appointment Button */}
            <div className="mt-4">
              <button
                className="btn btn-lg text-white"
                style={{ backgroundColor: "#003f3f" }}
                onClick={() => navigate("/appointment")} // Navigate to appointment page
              >
                <i className="bi bi-calendar-check me-2"></i> Book Appointment
              </button>
            </div>

            {/* Agent Details */}
            <div className="card border-0 shadow-sm p-3 mt-4">
              <div className="d-flex align-items-center">
                <img src={agent} className="rounded-circle me-3" style={{ width: "60px", height: "60px" }} alt="Agent" />
                <div>
                  <h5 className="mb-0">Alicia Huston</h5>
                  <p className="text-muted">Real Estate Agent</p>
                </div>
              </div>
              <p className="mt-2">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos officiis ea est facere mollitia dolor, consequuntur saepe maiores ullam nulla aliquid unde ipsam ducimus.
              </p>
              <div className="d-flex gap-3">
                <i className="bi bi-instagram fs-4"></i>
                <i className="bi bi-twitter fs-4"></i>
                <i className="bi bi-facebook fs-4"></i>
                <i className="bi bi-linkedin fs-4"></i>
              </div>
            </div>
          </div>
          <div className="card p-4 mt-5">
          <h4>Leave a Review</h4>
          <form onSubmit={handleSubmit}>
            <div className="row mb-3">
              <div className="col-md-4">
                <input type="text" className="form-control" placeholder="Your Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                {errors.name && <small className="text-danger">{errors.name}</small>}
              </div>
              <div className="col-md-4">
                <input type="email" className="form-control" placeholder="Your Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                {errors.email && <small className="text-danger">{errors.email}</small>}
              </div>
              <div className="col-md-4">
                <input type="text" className="form-control" placeholder="Your Review" value={formData.review} onChange={(e) => setFormData({ ...formData, review: e.target.value })} />
                {errors.review && <small className="text-danger">{errors.review}</small>}
              </div>
            </div>
            <div className="mb-3">
                {[...Array(5)].map((_, index) => (
                <i
                  key={index}
                  className={`bi ${index < formData.rating ? "bi-star-fill" : "bi-star"} fs-3`}
                  onClick={() => setFormData({ ...formData, rating: index + 1 })}
                  style={{ cursor: "pointer", color: "#003f3f" }} // Changed star color
                ></i>
                ))}
                {errors.rating && <small className="text-danger d-block">{errors.rating}</small>}
              </div>
            <button type="submit" className="btn text-white" style={{ backgroundColor: "#003f3f" }}>Submit</button>
          </form>
        </div>
        </div>
      </div>
    </>
  );
};

export default PropertyDetails;
