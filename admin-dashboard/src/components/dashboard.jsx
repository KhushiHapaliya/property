import React from "react";
import { Card, Row, Col, Container } from "react-bootstrap";
import "./DashboardCards.css";

const Dashboard = () => {
  const cards = [
    {
      icon: "fa-user-tie",
      color: "primary",
      value: 50,
      title: "Total Agents",
      trend: "+5% this month",
      trendUp: true
    },
    {
      icon: "fa-users",
      color: "success",
      value: 200,
      title: "Total Users",
      trend: "+12% this month",
      trendUp: true
    },
    {
      icon: "fa-home",
      color: "warning",
      value: 75,
      title: "Total Properties",
      trend: "+3% this month",
      trendUp: true
    },
    {
      icon: "fa-handshake",
      color: "info",
      value: 15,
      title: "Active Deals",
      trend: "-2% this month",
      trendUp: false
    },
  ];

  const recentProperties = [
    { id: 1, name: "Modern Apartment", location: "Downtown", price: "$250,000", status: "For Sale" },
    { id: 2, name: "Family House", location: "Suburbs", price: "$350,000", status: "For Sale" },
    { id: 3, name: "Office Space", location: "Business District", price: "$1,200/month", status: "For Rent" },
  ];

  return (
    <Container fluid className="dashboard-container pt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="page-title mb-0">Dashboard</h2>
      </div>
      
      {/* Stat Cards */}
      <Row className="g-4 mb-4">
        {cards.map((card, index) => (
          <Col key={index} xs={12} sm={6} lg={3}>
            <Card className="dashboard-card h-100 border-0 shadow-sm">
              <Card.Body className="d-flex flex-column">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div className={`card-icon-circle bg-${card.color}-light`}>
                    <i className={`fas ${card.icon} text-${card.color}`}></i>
                  </div>
                  <span className={`badge bg-${card.color}-light text-${card.color} py-1 px-2`}>
                    {card.trend} {card.trendUp ? '↑' : '↓'}
                  </span>
                </div>
                <h3 className="card-value mb-1">{card.value}</h3>
                <p className="card-title text-muted mb-0">{card.title}</p>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      
      {/* Recent Properties */}
      <Row className="mb-4">
        <Col xs={12}>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white border-0 py-3">
              <h5 className="mb-0">Recent Properties</h5>
            </Card.Header>
            <Card.Body className="p-0 overflow-auto">
              <div className="table-container">
                <table className="table custom-table mb-0">
                  <thead>
                    <tr>
                      <th width="5%">ID</th>
                      <th width="30%">Property</th>
                      <th width="25%">Location</th>
                      <th width="20%">Price</th>
                      <th width="20%">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentProperties.map((property) => (
                      <tr key={property.id}>
                        <td>{property.id}</td>
                        <td>{property.name}</td>
                        <td>{property.location}</td>
                        <td><strong>{property.price}</strong></td>
                        <td>
                          <span className={`badge ${property.status === "For Sale" ? "bg-success" : "bg-info"}`}>
                            {property.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;