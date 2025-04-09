import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap
import agent1 from "./images/agent1.jpg";

const Profiles = () => {
  const navigate = useNavigate(); // React Router navigation hook

  const [user, setUser] = useState({
    firstName: "John",
    lastName: "Doe",
    address: "123 Street Name",
    city: "New York",
    state: "NY",
    email: "johndoe@example.com",
    phone: "1234567890",
    photo: agent1,
  });

  return (
    <div className="container d-flex justify-content-center mt-5 mb-5">
      <div className="p-4 shadow rounded bg-white w-100" style={{ maxWidth: "700px" }}>
        <div className="row">
          {/* Profile Photo Section */}
          <div className="col-md-4 d-flex flex-column align-items-center">
            <img
              src={user.photo}
              alt="Profile"
              className="rounded-circle"
              style={{ width: "120px", height: "120px", objectFit: "cover" }}
            />
            <div className="mt-3 w-100">
              <button
                className="btn w-100 mb-2"
                style={{ backgroundColor: "#003f3f", color: "white" }}
                onClick={() => navigate("/edit-profile", { state: { user } })}
              >
                Edit Profile
              </button>
              <button
                className="btn w-100"
                style={{ backgroundColor: "#003f3f", color: "white" }}
                onClick={() => navigate("/change-password")}
              >
                Change Password
              </button>
            </div>
          </div>

          {/* Profile Details Section */}
          <div className="col-md-8">
            <h2 className="fw-bold text-center mb-4">Profile</h2>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">First Name</label>
                <input type="text" className="form-control" value={user.firstName} disabled />
              </div>
              <div className="col-md-6">
                <label className="form-label">Last Name</label>
                <input type="text" className="form-control" value={user.lastName} disabled />
              </div>
              <div className="col-md-12">
                <label className="form-label">Address</label>
                <input type="text" className="form-control" value={user.address} disabled />
              </div>
              <div className="col-md-6">
                <label className="form-label">City</label>
                <input type="text" className="form-control" value={user.city} disabled />
              </div>
              <div className="col-md-6">
                <label className="form-label">State</label>
                <input type="text" className="form-control" value={user.state} disabled />
              </div>
              <div className="col-md-6">
                <label className="form-label">Email</label>
                <input type="email" className="form-control" value={user.email} disabled />
              </div>
              <div className="col-md-6">
                <label className="form-label">Phone Number</label>
                <input type="tel" className="form-control" value={user.phone} disabled />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profiles;
