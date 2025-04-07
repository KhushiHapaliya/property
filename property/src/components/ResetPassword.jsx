import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
      isValid = false;
    } else if (!/[A-Z]/.test(password)) {
      newErrors.password = "Password must contain at least one uppercase letter";
      isValid = false;
    } else if (!/[a-z]/.test(password)) {
      newErrors.password = "Password must contain at least one lowercase letter";
      isValid = false;
    } else if (!/[0-9]/.test(password)) {
      newErrors.password = "Password must contain at least one number";
      isValid = false;
    } else if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
      newErrors.password = "Password must contain at least one special character";
      isValid = false;
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
      isValid = false;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
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
        // Fix: Use the correct API URL with the proper environment variable
        // and ensure it matches the backend endpoint
        const response = await axios.post(`http://localhost:5000/api/User/reset-password/${token}`, { password });
        setMessage(response.data.message || "Password reset successfully!");
        setStatus("success");
        
        // Redirect to login after successful password reset
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } catch (error) {
        console.error("Reset password error:", error);
        setMessage(error.response?.data?.message || "Failed to reset password. Please try again.");
        setStatus("error");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow p-4" style={{ maxWidth: "400px", width: "100%" }}>
        <h2 className="text-center mb-4" style={{ color: "#003f3f" }}>Reset Password</h2>
        
        {message && (
          <div className={`alert alert-${status === "success" ? "success" : "danger"} mb-3`}>
            {message}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="password" className="form-label" style={{ color: "#003f3f" }}>
              New Password
            </label>
            <input
              type="password"
              className={`form-control ${errors.password ? "is-invalid" : ""}`}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
            {errors.password && <div className="invalid-feedback">{errors.password}</div>}
            <small className="form-text text-muted">
              Password must be at least 8 characters with uppercase, lowercase, number and special character.
            </small>
          </div>
          
          <div className="mb-3">
            <label htmlFor="confirmPassword" className="form-label" style={{ color: "#003f3f" }}>
              Confirm New Password
            </label>
            <input
              type="password"
              className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
            />
            {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary w-100 mb-3" 
            style={{ backgroundColor: "#003f3f", borderColor: "#003f3f" }}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Resetting Password...
              </>
            ) : (
              "Reset Password"
            )}
          </button>
          
          <div className="text-center">
            <Link to="/login" className="text-decoration-none" style={{ color: "#003f3f" }}>
              Return to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;