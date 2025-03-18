import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"; 

const ForgotPass = () => {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    let isValid = true;
    let newErrors = {};
    
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = "Email is required.";
      isValid = false;
    } else if (!emailPattern.test(email)) {
      newErrors.email = "Enter a valid email address.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Password reset link sent to:", email);
      navigate("/login");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow p-4" style={{ maxWidth: "400px", width: "100%" }}>
        <h2 className="text-center">Forgot Password</h2>
        <form onSubmit={handleSubmit} className="row g-3">
          <div className="col-md-12">
            <label className="form-label">Email:</label>
            <input 
              type="text" 
              className={`form-control ${errors.email ? "is-invalid" : ""}`} 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
            />
            {errors.email && <div className="text-danger">{errors.email}</div>}
          </div>
          <div className="col-12 text-center">
            <button 
              type="submit" 
              className="btn w-100" 
              style={{ backgroundColor: "#003f3f", color: "white" }} 
            >
              Reset Password
            </button>
          </div>
        </form>
        <p className="text-center mt-3">
          Remembered your password? <a href="/login" className="text-primary">Login</a>
        </p>
      </div>
    </div>
  );
};

export default ForgotPass;