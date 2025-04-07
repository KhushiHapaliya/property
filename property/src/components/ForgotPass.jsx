import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!email.trim()) {
      setError("Email is required");
      return;
    }
    
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await axios.post("http://localhost:5000/api/User/forgot-password", { email });
      setMessage(response.data.message);
      setStatus("success");
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to process request. Please try again.");
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow p-4" style={{ maxWidth: "400px", width: "100%" }}>
        <h2 className="text-center mb-4" style={{ color: "#003f3f" }}>Forgot Password</h2>
        
        {message && (
          <div className={`alert alert-${status === "success" ? "success" : "danger"} mb-3`}>
            {message}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label" style={{ color: "#003f3f" }}>
              Enter your email address
            </label>
            <input
              type="email"
              className={`form-control ${error ? "is-invalid" : ""}`}
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              style={{ color: "#003f3f" }}
            />
            {error && <div className="invalid-feedback">{error}</div>}
          </div>
          
          <div className="d-grid gap-2">
            <button 
              type="submit" 
              className="btn" 
              style={{ backgroundColor: "#003f3f", color: "white" }}
              disabled={loading}
            >
              {loading ? "Processing..." : "Reset Password"}
            </button>
          </div>
        </form>
        
        <p className="text-center mt-3">
          Remember your password? <Link to="/login" className="text-primary">Back to Login</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;