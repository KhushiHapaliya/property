import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaBirthdayCake, FaTransgender, FaLock } from "react-icons/fa";
import "./profile.css";

const Profile = () => {
  const [profile, setProfile] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    phone: "123-456-7890",
    address: "123 Main Street",
    city: "New York",
    state: "NY",
    dateOfBirth: "1990-01-01",
    gender: "Male",
    profilePicture: require("./images/profile.jpg"), // Placeholder image
    password: "********",
  });

  const [showModal, setShowModal] = useState(false);
  const [editProfile, setEditProfile] = useState({});
  const [imagePreview, setImagePreview] = useState(profile.profilePicture);
  const [errors, setErrors] = useState({}); // For managing field errors

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditProfile({ ...editProfile, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setEditProfile({ ...editProfile, profilePicture: URL.createObjectURL(file) });
    }
  };

  // ✅ Validation function
  const validate = () => {
    const newErrors = {};
    if (!editProfile.firstName) newErrors.firstName = "First Name is required.";
    if (!editProfile.lastName) newErrors.lastName = "Last Name is required.";
    if (!editProfile.email) newErrors.email = "Email is required.";
    else if (!/^\S+@\S+\.\S+$/.test(editProfile.email)) newErrors.email = "Email format is invalid.";
    if (!editProfile.phone) newErrors.phone = "Phone number is required.";
    else if (!/^\d{3}-\d{3}-\d{4}$/.test(editProfile.phone)) newErrors.phone = "Phone format should be 123-456-7890.";
    if (!editProfile.address) newErrors.address = "Address is required.";
    if (!editProfile.city) newErrors.city = "City is required.";
    if (!editProfile.state) newErrors.state = "State is required.";
    if (!editProfile.dateOfBirth) newErrors.dateOfBirth = "Date of Birth is required.";
    if (!editProfile.gender) newErrors.gender = "Gender is required.";
    if (!editProfile.password) newErrors.password = "Password is required.";
    else if (editProfile.password.length < 6) newErrors.password = "Password must be at least 6 characters.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Submit handler with validation
  const handleSubmit = () => {
    if (validate()) {
      setProfile({ ...profile, ...editProfile });
      setShowModal(false);
    }
  };

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center min-vh-100">
      <div className="card shadow-lg p-4" style={{ maxWidth: "1000px", width: "100%" }}>
        <div className="text-center mb-4">
          <img
            src={profile.profilePicture}
            alt="Profile"
            className="rounded-circle"
            style={{ width: "180px", height: "180px", objectFit: "cover", border: "5px solid #ddd" }}
          />
          <h2 className="mt-3">{profile.firstName} {profile.lastName}</h2>
        </div>

        <div className="row text-left">
          <div className="col-md-6 mb-3"><FaEnvelope className="me-2" /> <strong>Email:</strong> {profile.email}</div>
          <div className="col-md-6 mb-3"><FaPhone className="me-2" /> <strong>Phone:</strong> {profile.phone}</div>
          <div className="col-md-6 mb-3"><FaMapMarkerAlt className="me-2" /> <strong>Address:</strong> {profile.address}, {profile.city}, {profile.state}</div>
          <div className="col-md-6 mb-3"><FaBirthdayCake className="me-2" /> <strong>Date of Birth:</strong> {profile.dateOfBirth}</div>
          <div className="col-md-6 mb-3"><FaTransgender className="me-2" /> <strong>Gender:</strong> {profile.gender}</div>
          <div className="col-md-6 mb-3"><FaLock className="me-2" /> <strong>Password:</strong> {profile.password}</div>
        </div>

        <div className="text-center">
          <button className="btn btn-primary px-5 mt-3" onClick={() => { setEditProfile(profile); setImagePreview(profile.profilePicture); setShowModal(true); }}>
            Edit Profile
          </button>
        </div>
      </div>

      {/* ✅ Modal */}
      {showModal && (
        <div className="modal show fade d-block" tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Profile</h5>
                <button className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body row">
                {[
                  { label: "First Name", name: "firstName" },
                  { label: "Last Name", name: "lastName" },
                  { label: "Email", name: "email", type: "email" },
                  { label: "Phone", name: "phone" },
                  { label: "Address", name: "address" },
                  { label: "City", name: "city" },
                  { label: "State", name: "state" },
                  { label: "Date of Birth", name: "dateOfBirth", type: "date" },
                  { label: "Password", name: "password", type: "password" },
                ].map((field, idx) => (
                  <div className="col-md-6 mb-3" key={idx}>
                    <label>{field.label}:</label>
                    <input
                      type={field.type || "text"}
                      name={field.name}
                      value={editProfile[field.name] || ""}
                      onChange={handleChange}
                      className={`form-control ${errors[field.name] ? 'is-invalid' : ''}`}
                    />
                    {errors[field.name] && <div className="invalid-feedback">{errors[field.name]}</div>}
                  </div>
                ))}
                <div className="col-md-6 mb-3">
                  <label>Gender:</label>
                  <select name="gender" value={editProfile.gender || ""} onChange={handleChange} className={`form-control ${errors.gender ? 'is-invalid' : ''}`}>
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.gender && <div className="invalid-feedback">{errors.gender}</div>}
                </div>
                <div className="col-md-6 mb-3">
                  <label>Upload Profile Picture:</label>
                  <input type="file" className="form-control" onChange={handleImageChange} />
                </div>
                {imagePreview && (
                  <div className="col-md-6 mb-3 text-center">
                    <label>Preview:</label>
                    <img src={imagePreview} alt="Preview" className="rounded-circle mt-2" style={{ height: "100px", width: "100px", objectFit: "cover" }} />
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button className="btn btn-success" onClick={handleSubmit}>Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
