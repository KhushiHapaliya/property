import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import house1 from "./images/house1.jpg";
import house2 from "./images/house2.jpg";
import house3 from "./images/house3.jpg";
import "bootstrap/dist/css/bootstrap.min.css";

const properties = [
  { id: 1, img: house1, price: "$1,291,000", address: "5232 California Fake, Ave. 21BC", location: "California, USA", beds: 2, baths: 2 },
  { id: 2, img: house2, price: "$1,450,000", address: "7315 Maple Drive, Apt. 7D", location: "New York, USA", beds: 3, baths: 2 },
  { id: 3, img: house3, price: "$980,000", address: "44 Ocean Avenue, Suite 5A", location: "Miami, USA", beds: 4, baths: 3 },
  { id: 4, img: house1, price: "$1,600,000", address: "112 Sunset Blvd, Villa 3", location: "Los Angeles, USA", beds: 5, baths: 4 },
  { id: 5, img: house2, price: "$875,000", address: "285 Palm Street, Apt. 2B", location: "San Diego, USA", beds: 2, baths: 2 },
  { id: 6, img: house3, price: "$1,100,000", address: "99 Emerald Lane, House 12", location: "Texas, USA", beds: 3, baths: 3 },
];

const AllProperties = () => {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleWishlist = (id) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredProperties = properties.filter(
    (property) =>
      property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
    
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
          <p>Home / Agents</p>
        </div>
      </div>

      {/* Search Bar */}
      <Container className="my-4 d-flex justify-content-center">
        <Form className="d-flex" style={{ maxWidth: "400px", width: "100%" }}>
          <Form.Control
            type="text"
            placeholder="Search properties..."
            className="me-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button style={{ backgroundColor: "#003f3f", border: "none" }}>Search</Button>
        </Form>
      </Container>

      {/* Properties Section */}
      <Container className="my-5">
        <h2 className="text-center mb-4">Popular Properties</h2>
        <Row className="g-4 align-items-stretch"> {/* Ensure equal height */}
          {filteredProperties.map((property) => (
            <Col md={4} key={property.id}>
              <Card className="shadow-sm d-flex flex-column h-100">
                <Card.Img 
                  variant="top" 
                  src={property.img} 
                  alt={`Property in ${property.location}`} 
                  style={{ height: "250px", objectFit: "cover" }} 
                />
                <Card.Body className="d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-center">
                    <h4 className="mb-0">{property.price}</h4>
                    <FaHeart
                      size={24}
                      className="cursor-pointer"
                      color={wishlist.includes(property.id) ? "red" : "gray"}
                      onClick={() => toggleWishlist(property.id)}
                    />
                  </div>
                  <Card.Text className="mt-2">
                    <strong>{property.address}</strong><br />
                    <span className="text-muted">{property.location}</span>
                  </Card.Text>
                  <div className="d-flex justify-content-between text-muted">
                    <span>🛏 {property.beds} beds</span>
                    <span>🛁 {property.baths} baths</span>
                  </div>
                  <div className="mt-auto">
                    <Button style={{ backgroundColor: "#003f3f", border: "none" }} className="w-100" onClick={() => navigate(`/property/${property.id}`)}>
                      See Details
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
};

export default AllProperties;