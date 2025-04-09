import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Spinner, Button } from "react-bootstrap";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaStar, FaRegStar } from "react-icons/fa";
import axios from "axios";

const AgentDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [agent, setAgent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", review: "", rating: 0 });
  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState(null);

  useEffect(() => {
    const fetchAgent = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/agents/${id}`);
        setAgent(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching agent:", err);
        setError("Failed to fetch agent details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAgent();
  }, [id]);

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
      // For now, just simulate a successful submission
      setSubmitStatus("success");
      setTimeout(() => {
        setSubmitStatus(null);
        setFormData({ name: "", email: "", review: "", rating: 0 });
      }, 3000);
    }
  };

  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="text-center my-5">
        <div className="alert alert-danger">{error}</div>
        <div className="mt-3">
          <Button 
            variant="primary" 
            className="me-2"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
          <Button 
            variant="secondary"
            onClick={() => navigate('/agents')}
          >
            Back to Agents
          </Button>
        </div>
      </Container>
    );
  }

  if (!agent) {
    return (
      <Container className="text-center my-5">
        <h2 className="text-danger">Agent Not Found</h2>
        <button 
          className="btn btn-primary mt-3"
          onClick={() => navigate('/agents')}
        >
          Back to Agents
        </button>
      </Container>
    );
  }

  const renderStars = (count) => {
    const rating = Math.round(count);
    return (
      <>
        {[...Array(5)].map((_, index) => (
          index < rating ? (
            <FaStar key={index} style={{ color: "#003f3f", fontSize: "28px" }} />
          ) : (
            <FaRegStar key={index} style={{ color: "#003f3f", fontSize: "28px" }} />
          )
        ))}
      </>
    );
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col lg={10}>
          <Card className="p-4 shadow-lg">
            <Row className="align-items-center">
              {/* Left Side: Agent Image and Star Rating */}
              <Col md={5} className="text-center">
                <img
                  src={agent.picture.startsWith("http") ? agent.picture : `http://localhost:5000${agent.picture}`}
                  alt={agent.name}
                  className="rounded-circle img-fluid"
                  style={{ width: "250px", height: "250px", objectFit: "cover" }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/images/default-agent.jpg";
                  }}
                />
                {/* Star Rating */}
                <div className="mt-3">
                  {renderStars(agent.rating)}
                </div>
              </Col>

              {/* Right Side: Agent Details */}
              <Col md={7}>
                <h2 className="fw-bold">{agent.name}</h2>
                <h5 className="text-muted">{agent.description || "Real Estate Agent"}</h5>
                <p className="text-secondary mt-3">
                  {agent.name} is a highly experienced real estate professional with 
                  {agent.propertiesSold ? ` ${agent.propertiesSold} properties sold` : " several years of experience"}.
                  Currently working with {agent.propertiesUnder || 0} active listings.
                </p>

                {/* Contact Details */}
                <div className="mt-4">
                  <p><FaPhone className="me-2 text-success" /> {agent.phone}</p>
                  <p><FaEnvelope className="me-2 text-primary" /> {agent.email}</p>
                  <p><FaMapMarkerAlt className="me-2 text-danger" /> {agent.officeAddress || "123 Main Street, New York, USA"}</p>
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
            {submitStatus === "success" && (
              <div className="alert alert-success">Review submitted successfully!</div>
            )}
            <form onSubmit={handleSubmit}>
              <Row className="mb-3">
                <Col md={6} className="mb-3">
                  <label htmlFor="name" className="form-label">Your Name</label>
                  <input
                    id="name"
                    type="text"
                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                  {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                </Col>
                <Col md={6} className="mb-3">
                  <label htmlFor="email" className="form-label">Your Email</label>
                  <input
                    id="email"
                    type="email"
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                  {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </Col>
              </Row>

              <div className="mb-3">
                <label htmlFor="review" className="form-label">Your Review</label>
                <textarea
                  id="review"
                  className={`form-control ${errors.review ? 'is-invalid' : ''}`}
                  rows="3"
                  value={formData.review}
                  onChange={(e) => setFormData({ ...formData, review: e.target.value })}
                ></textarea>
                {errors.review && <div className="invalid-feedback">{errors.review}</div>}
              </div>

              {/* Rating Selection */}
              <div className="mb-3">
                <label className="form-label d-block">Rating</label>
                {[...Array(5)].map((_, index) => (
                  <FaStar
                    key={index}
                    onClick={() => setFormData({ ...formData, rating: index + 1 })}
                    style={{
                      cursor: "pointer",
                      color: index < formData.rating ? "#003f3f" : "#ccc",
                      fontSize: "28px",
                      marginRight: "5px"
                    }}
                  />
                ))}
                {errors.rating && <div className="text-danger mt-1">{errors.rating}</div>}
              </div>

              {/* Submit Button */}
              <button type="submit" className="btn text-white" style={{ backgroundColor: "#003f3f" }}>
                Submit Review
              </button>
            </form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AgentDetails;