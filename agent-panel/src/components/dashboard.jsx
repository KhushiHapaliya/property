import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      {/* Single welcome heading */}
      <div className="welcome-banner mb-4">
        <h2 className="dashboard-title">Welcome, Agent</h2>
      </div>

      <div className="dashboard-cards-container">
        {/* Card 1 */}
        <div className="dashboard-card-wrapper">
          <div className="dashboard-card">
            <i className="bi bi-house-door-fill text-info"></i>
            <h3>75</h3>
            <p>Total Properties</p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="dashboard-card-wrapper">
          <div className="dashboard-card">
            <i className="bi bi-calendar-check-fill text-info"></i>
            <h3>18</h3>
            <p>Appointments</p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="dashboard-card-wrapper">
          <div className="dashboard-card">
            <i className="bi bi-cash-stack text-info"></i>
            <h3>9</h3>
            <p>Deals Closed</p>
          </div>
        </div>

        {/* Card 4 */}
        <div className="dashboard-card-wrapper">
          <div className="dashboard-card">
            <i className="bi bi-person-fill text-info"></i>
            <h3>4</h3>
            <p>Active Clients</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;