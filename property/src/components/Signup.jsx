import React, { useState } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "./Style.css"; // Ensure styles are included

const Signup = () => {
  const [formData, setFormData] = useState({
    role: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    photo: null,
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    let newErrors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^[0-9]{10}$/;

    if (!formData.role) newErrors.role = "Role is required";
    if (!formData.firstName.trim()) newErrors.firstName = "First Name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last Name is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state.trim()) newErrors.state = "State is required";

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailPattern.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!phonePattern.test(formData.phone)) {
      newErrors.phone = "Phone number must be 10 digits";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = "Password must contain at least one uppercase letter";
    } else if (!/[a-z]/.test(formData.password)) {
      newErrors.password = "Password must contain at least one lowercase letter";
    } else if (!/[0-9]/.test(formData.password)) {
      newErrors.password = "Password must contain at least one number";
    } else if (!/[\W]/.test(formData.password)) {
      newErrors.password = "Password must contain at least one special character";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirm Password is required";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.photo) newErrors.photo = "Profile photo is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, photo: e.target.files[0] });
    setErrors({ ...errors, photo: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      alert("Signup successful");
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center pb-5">
      <div className="container mt-5 mb-5">
        <div className="row justify-content-center">
          <div className="col-lg-6 col-md-8 col-sm-10">
            <div className="card shadow p-4">
              <h2 className="text-center" style={{ color: "#003f3f" }}>Sign Up</h2>
              <form onSubmit={handleSubmit} className="row g-3">
                
                {/* Role Dropdown */}
                <div className="col-md-12">
                  {/* <label className="form-label" style={{ color: "#003f3f" }}>Role:</label> */}
                  <select   
                    className={`form-select ${errors.role ? "is-invalid" : ""}`} 
                    name="role" 
                    value={formData.role} 
                    onChange={handleChange} 
                  >
                    <option value="">Select Role</option>
                    <option value="User">User</option>
                    <option value="Agent">Agent</option>
                    <option value="Admin">Admin</option>
                  </select>
                  {errors.role && <small className="text-danger">{errors.role}</small>}
                </div>

                {/* Other Input Fields */}
                {[
                  { name: "firstName", placeholder: "First Name" },
                  { name: "lastName", placeholder: "Last Name" },
                  { name: "address", placeholder: "Address" },
                  { name: "city", placeholder: "City" },
                  { name: "state", placeholder: "State" },
                  { name: "email", placeholder: "Email", type: "email" },
                  { name: "phone", placeholder: "Phone Number", type: "tel" },
                  { name: "password", placeholder: "Password", type: "password" },
                  { name: "confirmPassword", placeholder: "Confirm Password", type: "password" },
                ].map((field, index) => (
                  <div className={`col-md-${field.name === "address" ? 12 : 6}`} key={index}>
                    <input
                      type={field.type || "text"}
                      name={field.name}
                      className="form-control"
                      placeholder={field.placeholder}
                      value={formData[field.name]}
                      onChange={handleChange}
                      style={{ color: "#003f3f" }}
                    />
                    {errors[field.name] && <small className="text-danger">{errors[field.name]}</small>}
                  </div>
                ))}

                {/* File Upload */}
                <div className="col-md-12">
                  <label className="form-label">Upload Profile Photo</label>
                  <input type="file" name="photo" className="form-control" accept="image/*" onChange={handleFileChange} />
                  {errors.photo && <small className="text-danger">{errors.photo}</small>}
                </div>

                {/* Submit Button */}
                <div className="col-12 text-center">
                  <button type="submit" className="btn w-100" style={{ backgroundColor: "#003f3f", color: "white" }}>
                    Sign Up
                  </button>
                </div>
              </form>

              {/* Login Link */}
              <p className="text-center mt-3">
                Already have an account? <Link to="/login" className="text-primary">Login</Link>
              </p>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
