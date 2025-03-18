import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Style.css";

const ChangePass = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  // Regex for strong password: At least 6 chars, 1 uppercase, 1 lowercase, 1 number
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;

  // Validate form fields
  const validateForm = () => {
    let newErrors = {};

    if (!formData.oldPassword.trim()) {
      newErrors.oldPassword = "Old password is required";
    }

    if (!formData.newPassword.trim()) {
      newErrors.newPassword = "New password is required";
    } else if (!strongPasswordRegex.test(formData.newPassword)) {
      newErrors.newPassword = "Password must have at least 6 chars, 1 uppercase, 1 lowercase, and 1 number";
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Confirm password is required";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // Remove error when user types
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Password Changed Successfully:", formData);
      navigate("/profile");
    }
  };

  return (
    <div className="profile-container">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h2 className="text-center">Change Password</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Old Password</label>
              <input
                type="password"
                className={`form-control ${errors.oldPassword ? "border-danger" : ""}`}
                name="oldPassword"
                value={formData.oldPassword}
                onChange={handleChange}
                
              />
              {errors.oldPassword && <div className="text-danger">{errors.oldPassword}</div>}
            </div>

            <div className="mb-3">
              <label className="form-label">New Password</label>
              <input
                type="password"
                className={`form-control ${errors.newPassword ? "border-danger" : ""}`}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                
              />
              {errors.newPassword && <div className="text-danger">{errors.newPassword}</div>}
            </div>

            <div className="mb-3">
              <label className="form-label">Confirm Password</label>
              <input
                type="password"
                className={`form-control ${errors.confirmPassword ? "border-danger" : ""}`}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                
              />
              {errors.confirmPassword && <div className="text-danger">{errors.confirmPassword}</div>}
            </div>

            <div className="d-flex justify-content-between">
              <button type="submit" className="btn btn-success px-4" disabled={Object.keys(errors).length > 0}>
                Save
              </button>
              <button type="button" className="btn btn-secondary px-4" onClick={() => navigate("/profile")}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePass;
