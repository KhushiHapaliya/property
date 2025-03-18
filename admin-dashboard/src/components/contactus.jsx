import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./contactus.css";

const ContactUs = () => {
  const [contactData, setContactData] = useState([
    {
      id: 1,
      userId: 101,
      name: "John Doe",
      email: "john@example.com",
      message: "I would like to inquire about your property listings. Please get back to me.",
    },
    {
      id: 2,
      userId: 102,
      name: "Jane Smith",
      email: "jane@example.com",
      message: "Can you provide more information about your services?",
    },
    {
      id: 3,
      userId: 103,
      name: "Mike Johnson",
      email: "mike@example.com",
      message: "I want to book a meeting with an agent. How can I proceed?",
    },
  ]);

  // ✅ Delete Handler
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      setContactData(contactData.filter((item) => item.id !== id));
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Manage Contact Us Messages</h1>

      {/* ✅ Contact Table */}
      <div className="table-container">
        <table className="table custom-table">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>User ID</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Message</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {contactData.length > 0 ? (
              contactData.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>{item.userId}</td>
                  <td>{item.name}</td>
                  <td>{item.email}</td>
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
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
                  No contact messages found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ContactUs;
