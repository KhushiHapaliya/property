import React, { useState } from 'react';
import { FaEnvelope, FaPhone, FaBuilding, FaBriefcase, FaCheckCircle, FaMapMarkerAlt, FaInfoCircle } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import profile from './images/profile.jpg';

const Profile = () => {
  const defaultProfile = profile;
  const [profilePic, setProfilePic] = useState(defaultProfile);
  const [showModal, setShowModal] = useState(false);
  const [errors, setErrors] = useState({});

  const [agent, setAgent] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+91-9876543210',
    agency: 'Dream Homes Realty',
    experience: 5,
    dealsClosed: 42,
    location: 'Mumbai, Maharashtra',
    bio: 'Experienced real estate agent specializing in luxury apartments and commercial spaces.',
    status: 'Active'
  });

  // Image Change Handler
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Input Change Handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAgent((prev) => ({ ...prev, [name]: value }));
  };

  // Validation
  const validate = () => {
    const newErrors = {};
    if (!agent.name.trim()) newErrors.name = 'Name is required';
    if (!agent.email.trim()) newErrors.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(agent.email)) newErrors.email = 'Invalid email format';
    if (!agent.phone.trim()) newErrors.phone = 'Phone is required';
    else if (!/^\+?[0-9]{10,15}$/.test(agent.phone)) newErrors.phone = 'Invalid phone number';
    if (agent.experience < 0) newErrors.experience = 'Experience cannot be negative';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit Handler
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      setShowModal(false);
      alert('Profile updated successfully!');
    }
  };

  return (
    <div className="container py-4">
      <div className="card shadow-lg p-4">

        {/* Profile Picture and Name */}
        <div className="text-center">
          <label style={{ cursor: 'pointer' }}>
            <img src={profilePic} alt="Profile" className="rounded-circle mb-3" width="150" height="150" />
            <input type="file" accept="image/*" hidden onChange={handleImageChange} />
          </label>
          <h2>{agent.name}</h2>
          <span className={`badge ${agent.status === 'Active' ? 'bg-success' : 'bg-secondary'}`}>{agent.status}</span>
        </div>

        {/* Details Section */}
        <div className="row mt-4">
          <div className="col-md-6">
            <p><FaEnvelope /> <strong>Email:</strong> {agent.email}</p>
            <p><FaPhone /> <strong>Phone:</strong> {agent.phone}</p>
            <p><FaBuilding /> <strong>Agency:</strong> {agent.agency}</p>
            <p><FaMapMarkerAlt /> <strong>Location:</strong> {agent.location}</p>
          </div>
          <div className="col-md-6">
            <p><FaBriefcase /> <strong>Experience:</strong> {agent.experience} years</p>
            <p><FaCheckCircle /> <strong>Deals Closed:</strong> {agent.dealsClosed}</p>
            <p><FaInfoCircle /> <strong>Bio:</strong> {agent.bio}</p>
          </div>
        </div>

        {/* Edit Button */}
        <div className="text-center mt-4">
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>Edit Profile</button>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Profile</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleFormSubmit}>

                  {/* Image Upload */}
                  <div className="mb-3 text-center">
                    <img src={profilePic} alt="Preview" className="rounded-circle mb-2" width="120" height="120" />
                    <input type="file" accept="image/*" onChange={handleImageChange} />
                  </div>

                  {/* Form Fields */}
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <input type="text" name="name" value={agent.name} onChange={handleInputChange} placeholder="Name" className="form-control" />
                      {errors.name && <div className="text-danger">{errors.name}</div>}
                    </div>
                    <div className="col-md-6 mb-3">
                      <input type="email" name="email" value={agent.email} onChange={handleInputChange} placeholder="Email" className="form-control" />
                      {errors.email && <div className="text-danger">{errors.email}</div>}
                    </div>
                    <div className="col-md-6 mb-3">
                      <input type="text" name="phone" value={agent.phone} onChange={handleInputChange} placeholder="Phone" className="form-control" />
                      {errors.phone && <div className="text-danger">{errors.phone}</div>}
                    </div>
                    <div className="col-md-6 mb-3">
                      <input type="text" name="agency" value={agent.agency} onChange={handleInputChange} placeholder="Agency" className="form-control" />
                    </div>
                    <div className="col-md-6 mb-3">
                      <input type="number" name="experience" value={agent.experience} onChange={handleInputChange} placeholder="Experience (Years)" className="form-control" />
                      {errors.experience && <div className="text-danger">{errors.experience}</div>}
                    </div>
                    <div className="col-md-6 mb-3">
                      <input type="text" name="location" value={agent.location} onChange={handleInputChange} placeholder="Location" className="form-control" />
                    </div>
                    <div className="col-12 mb-3">
                      <textarea name="bio" value={agent.bio} onChange={handleInputChange} placeholder="Bio" className="form-control" rows="3"></textarea>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="modal-footer">
                    <button type="submit" className="btn btn-success">Save</button>
                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                  </div>

                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
