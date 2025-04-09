import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const status = params.get("status");
    const message = params.get("message");
    
    if (status && message) {
      setStatusType(status);
      setStatusMessage(message);
    }
  }, [location]);

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

    if (!password.trim()) {
      newErrors.password = "Password is required.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      
      try {
        const { data } = await axios.post("http://localhost:5000/api/User/login", {
          email,
          password,
        });

        // Store token and user data
        localStorage.setItem("token", data.token);
        localStorage.setItem("userRole", data.user.role);
        localStorage.setItem("userData", JSON.stringify(data.user));

        setStatusMessage(data.message);
        setStatusType(data.status);

        // Log the redirection attempt for debugging
        console.log(`Redirecting user with role: ${data.user.role}`);

        setTimeout(() => {
          // Determine the base URL for your applications
          const baseUrl = window.location.origin; // e.g., http://localhost:5173
          
          if (data.user.role === "admin") {
            // Redirect to admin dashboard application
            window.location.href = "http://localhost:3000/admin-dashboard/";
          } else if (data.user.role === "agent") {
            // Redirect to agent panel application
            window.location.href = "http://localhost:3000/agent-panel/";
          } else if (data.user.role === "user") {
            // Stay in the property application
            navigate("/");
          }
        }, 1000);

      } catch (error) {
        console.error("Login error:", error);
        setStatusType("error");
        setStatusMessage(
          error.response?.data?.message || 
          "Failed to login. Please check your credentials."
        );
        setLoading(false);
      }
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow p-4" style={{ maxWidth: "400px", width: "100%" }}>
        <h2 className="text-center" style={{ color: "#003f3f" }}>Login</h2>
        
        {statusMessage && (
          <div className={`alert alert-${statusType === "success" ? "success" : "danger"} mb-3`}>
            {statusMessage}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="row g-3">
          <div className="col-md-12">
            <label className="form-label" style={{ color: "#003f3f" }}>Email:</label>
            <input 
              type="text" 
              className={`form-control ${errors.email ? "is-invalid" : ""}`} 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              style={{ color: "#003f3f" }}
            />
            {errors.email && <div className="text-danger">{errors.email}</div>}
          </div>
          <div className="col-md-12">
            <label className="form-label" style={{ color: "#003f3f" }}>Password:</label>
            <input 
              type="password" 
              className={`form-control ${errors.password ? "is-invalid" : ""}`} 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              style={{ color: "#003f3f" }}
            />
            {errors.password && <div className="text-danger">{errors.password}</div>}
          </div>
          <div className="col-12 text-end">
            <a href="/forgot-password" className="text-primary">Forgot Password?</a>
          </div>
          <div className="col-12 text-center">
            <button 
              type="submit" 
              className="btn w-100" 
              style={{ backgroundColor: "#003f3f", color: "white" }}
              disabled={loading}
            >
              {loading ? "Processing..." : "Login"}
            </button>
          </div>
        </form>
        <p className="text-center mt-3">
          Don't have an account? <a href="/signup" className="text-primary">Sign up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;