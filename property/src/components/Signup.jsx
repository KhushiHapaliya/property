import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "./Style.css";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    role: "",
    first_nm: "",
    last_nm: "",
    address: "",
    city: "",
    state: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    profilePic: null,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    let newErrors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^[0-9]{10}$/;

    if (!formData.role) newErrors.role = "Role is required";
    if (!formData.first_nm.trim()) newErrors.first_nm = "First Name is required";
    if (!formData.last_nm.trim()) newErrors.last_nm = "Last Name is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state.trim()) newErrors.state = "State is required";

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailPattern.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = "Phone number is required";
    } else if (!phonePattern.test(formData.mobile)) {
      newErrors.mobile = "Phone number must be 10 digits";
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

    if (!formData.profilePic) newErrors.profilePic = "Profile photo is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, profilePic: e.target.files[0] });
    setErrors({ ...errors, profilePic: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setLoading(true);
      
      try {
        // Create FormData object for file upload
        const userData = new FormData();
        
        // Add all form fields to FormData
        Object.keys(formData).forEach(key => {
          if (key !== 'confirmPassword') { // Don't send confirmPassword to backend
            if (key === 'profilePic' && formData[key]) {
              userData.append(key, formData[key]);
            } else {
              userData.append(key, formData[key]);
            }
          }
        });
        
        // Make API call to your backend endpoint
        const response = await axios.post("http://localhost:5000/api/User/add-user", userData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        alert("Signup successful!");
        navigate('/login'); // Redirect to login page after successful signup
      } catch (error) {
        console.error("Signup error:", error);
        const errorMessage = error.response?.data?.error || "An error occurred during signup";
        alert(`Signup failed: ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center pb-5">
      <div className="container mt-5 mb-5">
        <div className="row justify-content-center">
          <div className="col-lg-6 col-md-8 col-sm-10">
            <div className="card shadow p-4">
              <h2 className="text-center" style={{ color: "#003f3f" }}>Sign Up</h2>
              <form onSubmit={handleSubmit} className="row g-3" encType="multipart/form-data">
                
                {/* Role Dropdown */}
                <div className="col-md-12">
                  <select   
                    className={`form-select ${errors.role ? "is-invalid" : ""}`} 
                    name="role" 
                    value={formData.role} 
                    onChange={handleChange} 
                  >
                    <option value="">Select Role</option>
                    <option value="user">User</option>
                    <option value="agent">Agent</option>
                    <option value="admin">Admin</option>
                  </select>
                  {errors.role && <small className="text-danger">{errors.role}</small>}
                </div>

                {/* Name fields */}
                <div className="col-md-6">
                  <input
                    type="text"
                    name="first_nm"
                    className="form-control"
                    placeholder="First Name"
                    value={formData.first_nm}
                    onChange={handleChange}
                    style={{ color: "#003f3f" }}
                  />
                  {errors.first_nm && <small className="text-danger">{errors.first_nm}</small>}
                </div>
                
                <div className="col-md-6">
                  <input
                    type="text"
                    name="last_nm"
                    className="form-control"
                    placeholder="Last Name"
                    value={formData.last_nm}
                    onChange={handleChange}
                    style={{ color: "#003f3f" }}
                  />
                  {errors.last_nm && <small className="text-danger">{errors.last_nm}</small>}
                </div>

                {/* Address fields */}
                <div className="col-md-12">
                  <input
                    type="text"
                    name="address"
                    className="form-control"
                    placeholder="Address"
                    value={formData.address}
                    onChange={handleChange}
                    style={{ color: "#003f3f" }}
                  />
                  {errors.address && <small className="text-danger">{errors.address}</small>}
                </div>
                
                <div className="col-md-6">
                  <input
                    type="text"
                    name="city"
                    className="form-control"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleChange}
                    style={{ color: "#003f3f" }}
                  />
                  {errors.city && <small className="text-danger">{errors.city}</small>}
                </div>
                
                <div className="col-md-6">
                  <input
                    type="text"
                    name="state"
                    className="form-control"
                    placeholder="State"
                    value={formData.state}
                    onChange={handleChange}
                    style={{ color: "#003f3f" }}
                  />
                  {errors.state && <small className="text-danger">{errors.state}</small>}
                </div>

                {/* Contact and password fields */}
                <div className="col-md-6">
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    style={{ color: "#003f3f" }}
                  />
                  {errors.email && <small className="text-danger">{errors.email}</small>}
                </div>
                
                <div className="col-md-6">
                  <input
                    type="tel"
                    name="mobile"
                    className="form-control"
                    placeholder="Phone Number"
                    value={formData.mobile}
                    onChange={handleChange}
                    style={{ color: "#003f3f" }}
                  />
                  {errors.mobile && <small className="text-danger">{errors.mobile}</small>}
                </div>
                
                <div className="col-md-6">
                  <input
                    type="password"
                    name="password"
                    className="form-control"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    style={{ color: "#003f3f" }}
                  />
                  {errors.password && <small className="text-danger">{errors.password}</small>}
                </div>
                
                <div className="col-md-6">
                  <input
                    type="password"
                    name="confirmPassword"
                    className="form-control"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    style={{ color: "#003f3f" }}
                  />
                  {errors.confirmPassword && <small className="text-danger">{errors.confirmPassword}</small>}
                </div>

                {/* File Upload */}
                <div className="col-md-12">
                  <label className="form-label">Upload Profile Photo</label>
                  <input 
                    type="file" 
                    name="profilePic" 
                    className="form-control" 
                    accept="image/*" 
                    onChange={handleFileChange} 
                  />
                  {errors.profilePic && <small className="text-danger">{errors.profilePic}</small>}
                </div>

                {/* Submit Button */}
                <div className="col-12 text-center">
                  <button 
                    type="submit" 
                    className="btn w-100" 
                    style={{ backgroundColor: "#003f3f", color: "white" }}
                    disabled={loading}
                  >
                    {loading ? "Processing..." : "Sign Up"}
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