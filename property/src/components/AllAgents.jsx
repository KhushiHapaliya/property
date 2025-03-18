import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import agent1 from "./images/agent1.jpg";
import agent2 from "./images/agent2.jpg";
import agent3 from "./images/agent3.jpg";
import house2 from "./images/house2.jpg"; // ✅ Ensure this is correctly imported

export const agents = [
  { id: 1, name: "James Doe", role: "Real Estate Agent", image: agent1 },
  { id: 2, name: "Jean Smith", role: "Real Estate Agent", image: agent2 },
  { id: 3, name: "Alicia Huston", role: "Real Estate Agent", image: agent3 },
  { id: 4, name: "Michael Brown", role: "Senior Agent", image: agent1 },
  { id: 5, name: "Sophia Wilson", role: "Luxury Property Specialist", image: agent2 },
  { id: 6, name: "Robert Johnson", role: "Commercial Property Expert", image: agent3 },
];

const AllAgents = () => {
  const navigate = useNavigate();

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
          <p>Home / Agents</p>
        </div>
      </div>

      {/* Agents List */}
      <Container className="py-5">
        <h2 className="text-center mb-4">Meet Our Agents</h2>
        <Row>
          {agents.map((agent) => (
            <Col md={4} sm={6} xs={12} className="mb-4" key={agent.id}>
              <Card className="text-center border-0 shadow-sm p-3">
                <div className="d-flex justify-content-center">
                  <img
                    src={agent.image}
                    alt={agent.name}
                    className="rounded-circle img-fluid"
                    style={{ width: "120px", height: "120px", objectFit: "cover" }}
                  />
                </div>
                <Card.Body>
                  <Card.Title className="fw-bold">{agent.name}</Card.Title>
                  <Card.Subtitle className="text-muted">{agent.role}</Card.Subtitle>
                  <Card.Text className="text-secondary">
                    Passionate about real estate, {agent.name} ensures the best deals for clients.
                  </Card.Text>
                  <Button
                    className="w-50 py-2"
                    style={{ backgroundColor: "#003f3f", color: "white" }}
                    onClick={() => navigate(`/agentdetails/${agent.id}`)}
                  >
                    See details
                  </Button>
                  <div className="d-flex justify-content-center gap-3 mt-3">
                    <a href="#" className="text-dark"><FaTwitter /></a>
                    <a href="#" className="text-dark"><FaFacebookF /></a>
                    <a href="#" className="text-dark"><FaLinkedinIn /></a>
                    <a href="#" className="text-dark"><FaInstagram /></a>
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

export default AllAgents;
