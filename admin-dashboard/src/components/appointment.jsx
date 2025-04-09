import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./appointment.css";
import axios from "axios";

const Appointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get user info from localStorage if logged in
  const getUserFromLocalStorage = () => {
    const userString = localStorage.getItem("user");
    return userString ? JSON.parse(userString) : null;
  };
  
  const currentUser = getUserFromLocalStorage();
  
  // Fetch appointments from API
  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        // Get the token from localStorage or wherever you store it
        const token = localStorage.getItem("token");
        
        if (!token) {
          setError("You must be logged in to view appointments");
          setLoading(false);
          return;
        }
        
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };
        
        // Fetch appointments (admin gets all, regular user gets their own)
        const endpoint = currentUser?.role === "admin" 
          ? "http://localhost:5000/api/appointments"
          : "http://localhost:5000/api/appointments/my-appointments";
          
        const response = await axios.get(endpoint, config);
        setAppointments(response.data.data.appointments);
      } catch (err) {
        console.error("Error fetching appointments:", err);
        setError(err.response?.data?.message || "Failed to load appointments");
      } finally {
        setLoading(false);
      }
    };
    
    fetchAppointments();
  }, [currentUser?.role]);

  // Delete handler
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this appointment?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:5000/api/appointments/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        // Update local state after successful deletion
        setAppointments(appointments.filter(item => item._id !== id));
      } catch (err) {
        console.error("Error deleting appointment:", err);
        alert(err.response?.data?.message || "Failed to delete appointment");
      }
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="container mt-5">
      <h1>Booked Appointments</h1>

      {/* Loading and Error States */}
      {loading && <div className="alert alert-info">Loading appointments...</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Appointment Table */}
      {!loading && !error && (
        <div className="table-container">
          <table className="table custom-table">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                {currentUser?.role === "admin" && <th>User ID</th>}
                <th>Full Name</th>
                <th>Email Address</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
                <th>Message</th>
                <th>Property</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((item, index) => (
                <tr key={item._id}>
                  <td>{index + 1}</td>
                  {currentUser?.role === "admin" && <td>{item.user?._id || "N/A"}</td>}
                  <td>{item.name}</td>
                  <td>{item.email}</td>
                  <td>{formatDate(item.date)}</td>
                  <td>{item.time}</td>
                  <td>
                    <span className={`badge bg-${
                      item.status === "confirmed" ? "success" : 
                      item.status === "cancelled" ? "danger" : 
                      item.status === "completed" ? "info" : "warning"
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td>{item.message}</td>
                  <td>{item.property?.title || "N/A"}</td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(item._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {appointments.length === 0 && (
                <tr>
                  <td colSpan={currentUser?.role === "admin" ? "10" : "9"} className="text-center text-muted">
                    No appointments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Appointment;