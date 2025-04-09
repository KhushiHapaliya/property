import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Row, Col, Card, Button, Form, Spinner, Badge } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import agent from "./images/agent.jpg";

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", review: "", rating: 0 });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        setLoading(true);
        // Updated API endpoint to match backend route structure
        const response = await axios.get(`http://localhost:5000/api/properties/${id}`);
        setProperty(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching property details:", err);
        setError("Failed to load property details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyDetails();
  }, [id]);

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

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case "Available": return "success";
      case "Sold": return "danger";
      case "Pending": return "warning";
      case "Rented": return "info";
      default: return "secondary";
    }
  };

  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" role="status" variant="primary" />
        <p className="mt-2">Loading property details...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-5">
        <div className="alert alert-danger">{error}</div>
        <Button 
          variant="primary" 
          onClick={() => navigate('/properties')}
        >
          Back to Properties
        </Button>
      </Container>
    );
  }

  if (!property) {
    return (
      <Container className="my-5">
        <div className="alert alert-warning">Property not found</div>
        <Button 
          variant="primary" 
          onClick={() => navigate('/properties')}
        >
          Back to Properties
        </Button>
      </Container>
    );
  }

  // Fix image URL handling
  const propertyImage = property.picture.startsWith('http') ? 
    property.picture : 
    `http://localhost:5000${property.picture}`;

  return (
    <>
      {/* Hero Section */}
      <div 
        className="position-relative text-center text-white" 
        style={{ 
          height: "400px", 
          background: `url(${propertyImage}) center/cover no-repeat`,
          backgroundPosition: "center" 
        }}
      >
        <div className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center bg-dark bg-opacity-50">
          <h1 className="fw-bold">{property.title}</h1>
          <p className="mb-0">
            <Badge bg={getStatusBadgeClass(property.status)} className="fs-6">
              {property.status}
            </Badge>
          </p>
          <p className="mt-2">
            <i className="bi bi-geo-alt me-2"></i> 
            {property.location}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <Container className="my-5">
        <Row className="g-4">
          {/* Left Side - Property Details */}
          <Col lg={8}>
            <Card className="shadow-sm mb-4">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h2 className="fw-bold mb-0">{property.title}</h2>
                  <h3 className="text-success fw-bold mb-0">${property.price.toLocaleString()}</h3>
                </div>

                <hr />

                <h4 className="mb-3">Property Details</h4>
                <Row className="mb-4">
                  <Col sm={6} md={4} className="mb-3">
                    <div className="d-flex align-items-center">
                      <i className="bi bi-building fs-4 me-2 text-primary"></i>
                      <div>
                        <div className="text-muted">Property Type</div>
                        <div className="fw-bold">{property.type}</div>
                      </div>
                    </div>
                  </Col>
                  <Col sm={6} md={4} className="mb-3">
                    <div className="d-flex align-items-center">
                      <i className="bi bi-rulers fs-4 me-2 text-primary"></i>
                      <div>
                        <div className="text-muted">Area</div>
                        <div className="fw-bold">{property.area} sqft</div>
                      </div>
                    </div>
                  </Col>
                  <Col sm={6} md={4} className="mb-3">
                    <div className="d-flex align-items-center">
                      <i className="bi bi-house-door fs-4 me-2 text-primary"></i>
                      <div>
                        <div className="text-muted">Status</div>
                        <div className="fw-bold">
                          <Badge bg={getStatusBadgeClass(property.status)}>
                            {property.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col sm={6} md={4} className="mb-3">
                    <div className="d-flex align-items-center">
                      <i className="bi bi-bed fs-4 me-2 text-primary"></i>
                      <div>
                        <div className="text-muted">Bedrooms</div>
                        <div className="fw-bold">{property.bedrooms}</div>
                      </div>
                    </div>
                  </Col>
                  <Col sm={6} md={4} className="mb-3">
                    <div className="d-flex align-items-center">
                      <i className="bi bi-bathtub fs-4 me-2 text-primary"></i>
                      <div>
                        <div className="text-muted">Bathrooms</div>
                        <div className="fw-bold">{property.bathrooms}</div>
                      </div>
                    </div>
                  </Col>
                  <Col sm={6} md={4} className="mb-3">
                    <div className="d-flex align-items-center">
                      <i className="bi bi-calendar-date fs-4 me-2 text-primary"></i>
                      <div>
                        <div className="text-muted">Listed</div>
                        <div className="fw-bold">
                          {new Date(property.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>

                <h4 className="mb-3">Description</h4>
                <p className="text-muted">{property.description}</p>

                <div className="mt-4">
                  <Button
                    size="lg"
                    className="text-white"
                    style={{ backgroundColor: "#003f3f" }}
                    onClick={() => navigate("/appointment")}
                  >
                    <i className="bi bi-calendar-check me-2"></i> Book Appointment
                  </Button>
                </div>
              </Card.Body>
            </Card>

            {/* Property Images Gallery */}
            <Card className="shadow-sm mb-4">
              <Card.Body>
                <h4 className="mb-3">Property Images</h4>
                <Row className="g-3">
                  <Col md={12}>
                    <img 
                      src={propertyImage}
                      className="img-fluid rounded w-100" 
                      style={{ height: "300px", objectFit: "cover" }}
                      alt={property.title}
                      onError={(e) => {
                        e.target.src = "/images/property-placeholder.jpg";
                      }}
                    />
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Review Form */}
            <Card className="shadow-sm">
              <Card.Body>
                <h4 className="mb-4">Leave a Review</h4>
                <Form onSubmit={handleSubmit}>
                  <Row className="mb-3">
                    <Col md={6} className="mb-3">
                      <Form.Group>
                        <Form.Label>Your Name</Form.Label>
                        <Form.Control 
                          type="text" 
                          placeholder="Enter your name" 
                          value={formData.name} 
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                          isInvalid={!!errors.name}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.name}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6} className="mb-3">
                      <Form.Group>
                        <Form.Label>Your Email</Form.Label>
                        <Form.Control 
                          type="email" 
                          placeholder="Enter your email" 
                          value={formData.email} 
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                          isInvalid={!!errors.email}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.email}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={12} className="mb-3">
                      <Form.Group>
                        <Form.Label>Rating</Form.Label>
                        <div>
                          {[...Array(5)].map((_, index) => (
                          <i
                            key={index}
                            className={`bi ${index < formData.rating ? "bi-star-fill" : "bi-star"} fs-4`}
                            onClick={() => setFormData({ ...formData, rating: index + 1 })}
                            style={{ cursor: "pointer", color: index < formData.rating ? "#ffc107" : "#ccc", marginRight: "5px" }}
                          ></i>
                          ))}
                          {errors.rating && <div className="text-danger small mt-1">{errors.rating}</div>}
                        </div>
                      </Form.Group>
                    </Col>
                    <Col md={12} className="mb-3">
                      <Form.Group>
                        <Form.Label>Your Review</Form.Label>
                        <Form.Control 
                          as="textarea" 
                          rows={4}
                          placeholder="Write your review here..." 
                          value={formData.review} 
                          onChange={(e) => setFormData({ ...formData, review: e.target.value })} 
                          isInvalid={!!errors.review}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.review}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Button type="submit" style={{ backgroundColor: "#003f3f", border: "none" }}>
                    Submit Review
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>

          {/* Right Side - Agent and Related Info */}
          <Col lg={4}>
            {/* Agent Card */}
            <Card className="shadow-sm mb-4">
              <Card.Body>
                <h4 className="mb-3">Contact Agent</h4>
                <div className="text-center mb-3">
                  <img 
                    src={agent} 
                    className="rounded-circle" 
                    style={{ width: "100px", height: "100px", objectFit: "cover" }} 
                    alt="Agent" 
                  />
                </div>
                <div className="text-center mb-3">
                  <h5 className="mb-1">Alicia Huston</h5>
                  <p className="text-muted mb-2">Real Estate Agent</p>
                  <div className="d-flex justify-content-center gap-2">
                    <i className="bi bi-instagram fs-5"></i>
                    <i className="bi bi-twitter fs-5"></i>
                    <i className="bi bi-facebook fs-5"></i>
                    <i className="bi bi-linkedin fs-5"></i>
                  </div>
                </div>
                <hr />
                <div className="mb-3">
                  <div className="d-flex align-items-center mb-2">
                    <i className="bi bi-telephone me-2 text-primary"></i>
                    <span>+1 (555) 123-4567</span>
                  </div>
                  <div className="d-flex align-items-center mb-2">
                    <i className="bi bi-envelope me-2 text-primary"></i>
                    <span>alicia@realestate.com</span>
                  </div>
                </div>
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Control type="text" placeholder="Your Name" />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Control type="email" placeholder="Your Email" />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Control type="tel" placeholder="Your Phone" />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Control as="textarea" rows={3} placeholder="Your Message" />
                  </Form.Group>
                  <Button 
                    className="w-100" 
                    style={{ backgroundColor: "#003f3f", border: "none" }}
                  >
                    Send Message
                  </Button>
                </Form>
              </Card.Body>
            </Card>

            {/* Property Features */}
            <Card className="shadow-sm mb-4">
              <Card.Body>
                <h4 className="mb-3">Property Features</h4>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item d-flex align-items-center">
                    <i className="bi bi-check-circle-fill text-success me-2"></i>
                    {property.type} Property
                  </li>
                  <li className="list-group-item d-flex align-items-center">
                    <i className="bi bi-check-circle-fill text-success me-2"></i>
                    {property.bedrooms} Bedrooms
                  </li>
                  <li className="list-group-item d-flex align-items-center">
                    <i className="bi bi-check-circle-fill text-success me-2"></i>
                    {property.bathrooms} Bathrooms
                  </li>
                  <li className="list-group-item d-flex align-items-center">
                    <i className="bi bi-check-circle-fill text-success me-2"></i>
                    {property.area} sqft Area
                  </li>
                  <li className="list-group-item d-flex align-items-center">
                    <i className="bi bi-check-circle-fill text-success me-2"></i>
                    Built in {new Date(property.createdAt).getFullYear()}
                  </li>
                </ul>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default PropertyDetails;