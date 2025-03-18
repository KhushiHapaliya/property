import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"; // Ensure Bootstrap is included

const Login = () => {
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    let isValid = true;
    let newErrors = {};

    if (!role) {
      newErrors.role = "Please select a role.";
      isValid = false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = "Email is required.";
      isValid = false;
    } else if (!emailPattern.test(email)) {
      newErrors.email = "Enter a valid email address.";
      isValid = false;
    }

    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if (!password.trim()) {
      newErrors.password = "Password is required.";
      isValid = false;
    } else if (!passwordPattern.test(password)) {
      newErrors.password = "Password must contain 1 uppercase, 1 lowercase, 1 number, and 1 special character.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Login with:", { role, email, password });
      navigate("/profile");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow p-4" style={{ maxWidth: "400px", width: "100%" }}>
        <h2 className="text-center" style={{ color: "#003f3f" }}>Login</h2>
        <form onSubmit={handleSubmit} className="row g-3">
          <div className="col-md-12">
            <label className="form-label" style={{ color: "#003f3f" }}>Role:</label>
            <select 
              className={`form-select ${errors.role ? "is-invalid" : ""}`} 
              value={role} 
              onChange={(e) => setRole(e.target.value)}
              style={{ color: "#003f3f" }}
            >
              <option value="">Select Role</option>
              <option value="User">User</option>
              <option value="Agent">Agent</option>
              <option value="Admin">Admin</option>
            </select>
            {errors.role && <div className="text-danger">{errors.role}</div>}
          </div>
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
            >
              Login
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
