import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Spinner } from "react-bootstrap";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import house2 from "./images/house2.jpg";

const AllAgents = () => {
  const navigate = useNavigate();
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        setLoading(true);
        // Make sure we're using the correct API endpoint
        const response = await axios.get("http://localhost:5000/api/agents");
        setAgents(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching agents:", err);
        setError("Failed to fetch agents. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, []);

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
        
        {loading ? (
          <div className="text-center my-5">
            <Spinner animation="border" role="status" variant="primary">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : error ? (
          <div className="alert alert-danger text-center">
            {error}
            <div className="mt-3">
              <Button 
                variant="primary" 
                onClick={() => window.location.reload()}
              >
                Try Again
              </Button>
            </div>
          </div>
        ) : agents.length === 0 ? (
          <div className="alert alert-info text-center">No agents found</div>
        ) : (
          <Row>
            {agents.map((agent) => (
              <Col md={4} sm={6} xs={12} className="mb-4" key={agent._id}>
                <Card className="text-center border-0 shadow-sm p-3">
                  <div className="d-flex justify-content-center">
                    <img
                      src={agent.picture.startsWith("http") ? agent.picture : `http://localhost:5000${agent.picture}`}
                      alt={agent.name}
                      className="rounded-circle img-fluid"
                      style={{ width: "120px", height: "120px", objectFit: "cover" }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/images/default-agent.jpg";
                      }}
                    />
                  </div>
                  <Card.Body>
                    <Card.Title className="fw-bold">{agent.name}</Card.Title>
                    <Card.Subtitle className="text-muted">
                      {agent.description || "Real Estate Agent"}
                    </Card.Subtitle>
                    <Card.Text className="text-secondary">
                      Properties Sold: {agent.propertiesSold || 0} | Rating: {agent.rating || 0}/5
                    </Card.Text>
                    <Button
                      className="w-50 py-2"
                      style={{ backgroundColor: "#003f3f", color: "white" }}
                      onClick={() => navigate(`/agentdetails/${agent._id}`)}
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
        )}
      </Container>
    </>
  );
};

export default AllAgents;