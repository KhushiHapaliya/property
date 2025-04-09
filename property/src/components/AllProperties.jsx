import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import { Container, Row, Col, Card, Button, Form, Spinner } from "react-bootstrap";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const AllProperties = () => {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    type: "",
    minPrice: "",
    maxPrice: "",
    bedrooms: "",
    bathrooms: "",
    status: ""
  });

  // Fetch properties from the database

useEffect(() => {
  const fetchProperties = async () => {
    try {
      setLoading(true);
      // Change this URL to match one of the working routes in your backend
      const response = await axios.get("http://localhost:5000/api/properties");
      console.log("API Response:", response.data);
      setProperties(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching properties:", err);
      setError("Failed to load properties. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  fetchProperties();
}, []);
  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Apply filters
  const applyFilters = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      // Build query parameters
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      
      const response = await axios.get(`/api/properties/search?${params.toString()}`);
      setProperties(response.data);
    } catch (err) {
      console.error("Error applying filters:", err);
      setError("Failed to filter properties. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Toggle wishlist
  const toggleWishlist = (id) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Filter properties based on search term
  const filteredProperties = properties.filter(
    (property) =>
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && properties.length === 0) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" role="status" variant="primary" />
        <p className="mt-2">Loading properties...</p>
      </Container>
    );
  }

  if (error && properties.length === 0) {
    return (
      <Container className="my-5">
        <div className="alert alert-danger">{error}</div>
      </Container>
    );
  }

  return (
    <>
      <div
        className="hero-section"
        style={{
          backgroundImage: `url(/images/hero-bg.jpg)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "300px"
        }}
      >
        <div
          className="hero-overlay text-white text-center py-5 d-flex flex-column justify-content-center"
          style={{ background: "rgba(0,0,0,0.5)", height: "100%" }}
        >
          <h1>Find Your Dream Property</h1>
          <p>Home / Properties</p>
        </div>
      </div>

      {/* Search and Filter Section */}
      <Container className="my-4">
        <Card className="shadow-sm p-3">
          <Form onSubmit={applyFilters}>
            <Row className="g-3">
              <Col md={3}>
                <Form.Control
                  type="text"
                  placeholder="Search properties..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </Col>
              <Col md={2}>
                <Form.Select 
                  name="type" 
                  value={filters.type}
                  onChange={handleFilterChange}
                >
                  <option value="">Property Type</option>
                  <option value="House">House</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Villa">Villa</option>
                  <option value="Land">Land</option>
                  <option value="Commercial">Commercial</option>
                </Form.Select>
              </Col>
              <Col md={2}>
                <Form.Control
                  type="number"
                  placeholder="Min Price"
                  name="minPrice"
                  value={filters.minPrice}
                  onChange={handleFilterChange}
                />
              </Col>
              <Col md={2}>
                <Form.Control
                  type="number"
                  placeholder="Max Price"
                  name="maxPrice"
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                />
              </Col>
              <Col md={2}>
                <Button 
                  type="submit" 
                  className="w-100" 
                  style={{ backgroundColor: "#003f3f", border: "none" }}
                >
                  Filter
                </Button>
              </Col>
            </Row>
            <Row className="mt-3 g-3">
              <Col md={3}>
                <Form.Select
                  name="bedrooms"
                  value={filters.bedrooms}
                  onChange={handleFilterChange}
                >
                  <option value="">Bedrooms</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                  <option value="5">5+</option>
                </Form.Select>
              </Col>
              <Col md={3}>
                <Form.Select
                  name="bathrooms"
                  value={filters.bathrooms}
                  onChange={handleFilterChange}
                >
                  <option value="">Bathrooms</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                </Form.Select>
              </Col>
              <Col md={3}>
                <Form.Select
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                >
                  <option value="">Property Status</option>
                  <option value="Available">Available</option>
                  <option value="Sold">Sold</option>
                  <option value="Pending">Pending</option>
                  <option value="Rented">Rented</option>
                </Form.Select>
              </Col>
            </Row>
          </Form>
        </Card>
      </Container>

      {/* Properties Section */}
      <Container className="my-5">
        <h2 className="text-center mb-4">Available Properties</h2>
        
        {loading && properties.length > 0 && (
          <div className="text-center mb-4">
            <Spinner animation="border" variant="primary" size="sm" />
            <span className="ms-2">Updating results...</span>
          </div>
        )}
        
        {filteredProperties.length === 0 ? (
          <div className="alert alert-info text-center">
            No properties found matching your criteria. Please try different filters.
          </div>
        ) : (
          <Row className="g-4 align-items-stretch">
            {filteredProperties.map((property) => (
              <Col md={4} key={property._id}>
                <Card className="shadow-sm d-flex flex-column h-100">
                <Card.Img 
                  variant="top"
                  src={property.picture.startsWith("http") ? property.picture : `http://localhost:5000${property.picture}`}
                  alt={property.title}
                  style={{ height: "250px", objectFit: "cover" }}
                  onError={(e) => {
                    e.target.src = "/images/property-placeholder.jpg"; // Fallback image
                  }}
/>
                  <Card.Body className="d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-center">
                      <h4 className="mb-0">${property.price.toLocaleString()}</h4>
                      <span className={`badge ${property.status === "Available" ? "bg-success" : property.status === "Sold" ? "bg-danger" : property.status === "Pending" ? "bg-warning" : "bg-info"}`}>
                        {property.status}
                      </span>
                    </div>
                    <Card.Title className="mt-2">{property.title}</Card.Title>
                    <Card.Text className="text-muted">
                      <i className="bi bi-geo-alt me-1"></i> {property.location}
                    </Card.Text>
                    <div className="d-flex justify-content-between text-muted mb-3">
                      <span><i className="bi bi-building me-1"></i> {property.type}</span>
                      <span><i className="bi bi-rulers me-1"></i> {property.area} sqft</span>
                    </div>
                    <div className="d-flex justify-content-between text-muted mb-3">
                      <span><i className="bi bi-bed me-1"></i> {property.bedrooms} beds</span>
                      <span><i className="bi bi-bathtub me-1"></i> {property.bathrooms} baths</span>
                    </div>
                    <div className="mt-auto d-flex justify-content-between">
                      <Button 
                        style={{ backgroundColor: "#003f3f", border: "none" }} 
                        className="w-75"
                        onClick={() => navigate(`/property/${property._id}`)}
                      >
                        See Details
                      </Button>
                      <Button 
                        variant="outline-danger" 
                        className="ms-2"
                        onClick={() => toggleWishlist(property._id)}
                      >
                        <FaHeart 
                          size={18} 
                          color={wishlist.includes(property._id) ? "red" : "gray"} 
                        />
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </>
  );
};

export default AllProperties;