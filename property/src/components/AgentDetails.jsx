import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card } from "react-bootstrap";
import { agents } from "./AllAgents";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaStar, FaRegStar } from "react-icons/fa";

const AgentDetails = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", review: "", rating: 0 });
  const [errors, setErrors] = useState({});

  // Validation function
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

  // Submit function
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      alert("Review submitted successfully!");
      setFormData({ name: "", email: "", review: "", rating: 0 });
    }
  };

  const { id } = useParams();
  const agent = agents.find((a) => a.id === parseInt(id));

  if (!agent) {
    return <h2 className="text-center text-danger mt-5">Agent Not Found</h2>;
  }

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col lg={10}>
          <Card className="p-4 shadow-lg">
            <Row className="align-items-center">
              {/* Left Side: Agent Image and Star Rating */}
              <Col md={5} className="text-center">
                <img
                  src={agent.image}
                  alt={agent.name}
                  className="rounded-circle img-fluid"
                  style={{ width: "250px", height: "250px", objectFit: "cover" }}
                />
                {/* Star Rating (4 filled, 1 outlined) */}
                <div className="mt-3">
                  {[...Array(4)].map((_, index) => (
                    <FaStar key={index} style={{ color: "#003f3f", fontSize: "28px" }} />
                  ))}
                  <FaRegStar style={{ color: "#003f3f", fontSize: "28px" }} />
                </div>
              </Col>

              {/* Right Side: Agent Details */}
              <Col md={7}>
                <h2 className="fw-bold">{agent.name}</h2>
                <h5 className="text-muted">{agent.role}</h5>
                <p className="text-secondary mt-3">
                  {agent.name} is a highly experienced {agent.role} specializing in helping clients
                  find their perfect properties. With years of expertise, {agent.name} ensures smooth
                  and hassle-free transactions.
                </p>

                {/* Contact Details */}
                <div className="mt-4">
                  <p><FaPhone className="me-2 text-success" /> +1 (123) 456-7890</p>
                  <p><FaEnvelope className="me-2 text-primary" /> {agent.name.toLowerCase().replace(" ", ".")}@realestate.com</p>
                  <p><FaMapMarkerAlt className="me-2 text-danger" /> 123 Main Street, New York, USA</p>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {/* Review Form */}
      <Row className="justify-content-center mt-5">
        <Col lg={8}>
          <Card className="p-4">
            <h4>Leave a Review</h4>
            <form onSubmit={handleSubmit}>
              <Row className="mb-3">
                <Col md={4}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                  {errors.name && <small className="text-danger">{errors.name}</small>}
                </Col>
                <Col md={4}>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                  {errors.email && <small className="text-danger">{errors.email}</small>}
                </Col>
                <Col md={4}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Your Review"
                    value={formData.review}
                    onChange={(e) => setFormData({ ...formData, review: e.target.value })}
                  />
                  {errors.review && <small className="text-danger">{errors.review}</small>}
                </Col>
              </Row>

              {/* Rating Selection */}
              <div className="mb-3">
                {[...Array(5)].map((_, index) => (
                  <FaStar
                    key={index}
                    onClick={() => setFormData({ ...formData, rating: index + 1 })}
                    style={{
                      cursor: "pointer",
                      color: index < formData.rating ? "#003f3f" : "#ccc",
                      fontSize: "28px",
                    }}
                  />
                ))}
                {errors.rating && <small className="text-danger d-block">{errors.rating}</small>}
              </div>

              {/* Submit Button */}
              <button type="submit" className="btn text-white" style={{ backgroundColor: "#003f3f" }}>
                Submit
              </button>
            </form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AgentDetails;
