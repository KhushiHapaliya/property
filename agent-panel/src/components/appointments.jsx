import React, { useState } from 'react';
import '../styles/MyAppointments.css'; // Import CSS

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([
    { id: 1, name: 'John Doe', userId: 'USR123', status: 'Pending' },
    { id: 2, name: 'Jane Smith', userId: 'USR124', status: 'Pending' },
    { id: 3, name: 'Alice Johnson', userId: 'USR125', status: 'Pending' },
  ]);

  const handleAccept = (id) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'Accepted' } : a))
    );
  };

  const handleDecline = (id) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'Declined' } : a))
    );
  };

  return (

    <div className="dashboard-container">
      <h2 className="appointments-title">My Appointments</h2>
      <div className="appointment-cards">
        {appointments.map((app) => (
          <div key={app.id} className="appointment-card">
            <h5>{app.name}</h5>
            <p><strong>User ID:</strong> {app.userId}</p>
            <p><strong>Status:</strong> {app.status}</p>
            {app.status === 'Pending' && (
              <>
                <button
                  className="btn btn-success btn-sm"
                  onClick={() => handleAccept(app.id)}
                >
                  Accept
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDecline(app.id)}
                >
                  Decline
                </button>
              </>
            )}
            {app.status === 'Accepted' && (
              <span className="status-badge accepted">Accepted</span>
            )}
            {app.status === 'Declined' && (
              <span className="status-badge declined">Declined</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyAppointments;
