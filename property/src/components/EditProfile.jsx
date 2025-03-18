import React, { useState } from "react";
import "./Style.css";
import agent1 from "./images/agent1.jpg";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const navigate = useNavigate();
  
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

  const [errors, setErrors] = useState({});

  const validate = () => {
    let newErrors = {};

    if (!user.firstName.match(/^[a-zA-Z]+$/)) {
      newErrors.firstName = "First name should contain only letters.";
    }
    if (!user.lastName.match(/^[a-zA-Z]+$/)) {
      newErrors.lastName = "Last name should contain only letters.";
    }
    if (!user.email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)) {
      newErrors.email = "Enter a valid email address.";
    }
    if (!user.phone.match(/^\d{10}$/)) {
      newErrors.phone = "Phone number must be exactly 10 digits.";
    }
    if (!user.address.trim()) {
      newErrors.address = "Address is required.";
    }
    if (!user.city.trim()) {
      newErrors.city = "City is required.";
    }
    if (!user.state.trim()) {
      newErrors.state = "State is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setUser({ ...user, photo: imageUrl });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      console.log("Updated User Data:", user);
      navigate("/profile");
    }
  };

  return (
    <div className="profile-container">
      <div className="row">
        <div className="col-md-4 profile-photo-container text-center">
          <img src={user.photo} alt="Profile" className="profile-img" />
          <div className="mt-3">
            <label className="btn btn-secondary w-100">
              Change Photo
              <input type="file" accept="image/*" onChange={handlePhotoChange} hidden />
            </label>
          </div>
        </div>

        <div className="col-md-8 profile-details">
          <h2>Edit Profile</h2>
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              {[
                { label: "First Name", name: "firstName" },
                { label: "Last Name", name: "lastName" },
                { label: "Address", name: "address" },
                { label: "City", name: "city" },
                { label: "State", name: "state" },
                { label: "Email", name: "email", type: "email" },
                { label: "Phone Number", name: "phone", type: "tel" },
              ].map(({ label, name, type = "text" }) => (
                <div key={name} className={name === "address" ? "col-md-12" : "col-md-6"}>
                  <label className="form-label">{label}</label>
                  <input
                    type={type}
                    className="form-control"
                    name={name}
                    value={user[name]}
                    onChange={handleChange}
                    
                  />
                  {errors[name] && <small className="text-danger">{errors[name]}</small>}
                </div>
              ))}

              <div className="col-12 text-center mt-3">
                <button type="submit" className="btn btn-success me-2 px-4">Save Changes</button>
                <button type="button" className="btn btn-secondary px-4" onClick={() => navigate("/profile")}>
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
