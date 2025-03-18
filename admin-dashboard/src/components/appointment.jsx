import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./appointment.css";

const Appointment = () => {
  // ✅ Sample appointment data
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      userId: 101,
      agent: "David Johnson",
      fullName: "John Doe",
      email: "john@example.com",
      date: "2024-03-25",
      time: "10:00 AM",
      message: "Looking forward to discussing the property.",
    },
    {
      id: 2,
      userId: 102,
      agent: "Sarah Parker",
      fullName: "Jane Smith",
      email: "jane@example.com",
      date: "2024-03-26",
      time: "2:00 PM",
      message: "Need more information about the villa.",
    },
  ]);

  // ✅ Delete handler
  const handleDelete = (id) => setAppointments(appointments.filter((item) => item.id !== id));

  return (
    <div className="container mt-5">
      <h1>Booked Appointments</h1>

      {/* ✅ Appointment Table */}
      <div className="table-container">
        <table className="table custom-table">
          <thead className="table-dark">
            <tr>
              <th>Id</th>
              <th>User ID</th>
              <th>Agent</th>
              <th>Full Name</th>
              <th>Email Address</th>
              <th>Date</th>
              <th>Time</th>
              <th>Message</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.userId}</td>
                <td>{item.agent}</td>
                <td>{item.fullName}</td>
                <td>{item.email}</td>
                <td>{item.date}</td>
                <td>{item.time}</td>
                <td>{item.message}</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(item.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {appointments.length === 0 && (
              <tr>
                <td colSpan="9" className="text-center text-muted">
                  No appointments booked.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Appointment;
