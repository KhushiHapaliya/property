import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const Agents = () => {
  const [agents, setAgents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentAgent, setCurrentAgent] = useState({});
  const [viewAgent, setViewAgent] = useState({});
  const [errors, setErrors] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch agents on component mount
  useEffect(() => {
    fetchAgents();
  }, []);

  // Fetch all agents from API
  const fetchAgents = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/agents");
      setAgents(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch agents: " + (err.response?.data?.message || err.message));
      console.error("Error fetching agents:", err);
    } finally {
      setLoading(false);
    }
  };

  // Validate form input
  const validate = (agent) => {
    const newErrors = {};
    if (!agent.name) newErrors.name = "Name is required";
    if (!agent.phone) newErrors.phone = "Phone is required";
    if (!agent.email || !/\S+@\S+\.\S+/.test(agent.email))
      newErrors.email = "Valid email is required";
    if (!editMode && !imageFile && !agent.picture) newErrors.picture = "Picture is required";
    return newErrors;
  };

  // Handle form submission (create or update agent)
  const handleSubmit = async () => {
    const validationErrors = validate(currentAgent);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      // Create FormData for file upload
      const formData = new FormData();
      Object.keys(currentAgent).forEach(key => {
        if (key !== "picture" || typeof currentAgent[key] !== "string") {
          formData.append(key, currentAgent[key]);
        }
      });
      
      if (imageFile) {
        formData.append("picture", imageFile);
      }

      let response;
      if (editMode) {
        response = await axios.put(`/api/agents/${currentAgent._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      } else {
        response = await axios.post("/api/agents", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      }

      // Refresh agents list after successful operation
      fetchAgents();
      
      // Close modal and reset form
      resetForm();
    } catch (err) {
      setError("Error saving agent: " + (err.response?.data?.message || err.message));
      console.error("Error saving agent:", err);
    }
  };

  // Delete an agent
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this agent?")) {
      try {
        await axios.delete(`/api/agents/${id}`);
        fetchAgents();
      } catch (err) {
        setError("Error deleting agent: " + (err.response?.data?.message || err.message));
        console.error("Error deleting agent:", err);
      }
    }
  };

  // Reset form and close modal
  const resetForm = () => {
    setShowModal(false);
    setCurrentAgent({});
    setImageFile(null);
    setImagePreview("");
    setErrors({});
    setError(null);
  };

  // Get the complete image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "/images/default-agent.jpg";
    
    // If it's a complete URL, return it
    if (imagePath.startsWith("http")) return imagePath;
    
    // Otherwise, it's a relative path
    return imagePath;
  };

  const handleViewDetails = (agent) => {
    setViewAgent(agent);
    setShowViewModal(true);
  };

  return (
    <div className="container-fluid mt-5">
      <h2 className="text-center mb-4">Agent Management</h2>
      
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
          <button 
            type="button" 
            className="btn-close float-end" 
            onClick={() => setError(null)}
            aria-label="Close"
          ></button>
        </div>
      )}
      
      <div className="row mb-3">
        <div className="col-12 col-md-4 offset-md-8 d-flex justify-content-end">
          <button
            className="btn btn-success rounded-pill px-4 py-2 shadow-sm d-flex align-items-center ms-auto"
            onClick={() => {
              setEditMode(false);
              setCurrentAgent({});
              setImageFile(null);
              setImagePreview("");
              setShowModal(true);
            }}
          >
            <i className="bi bi-plus-circle me-2"></i>
            <span className="fw-medium">Add New Agent</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : agents.length === 0 ? (
        <div className="alert alert-info">No agents found. Add your first agent!</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover table-bordered">
            <thead className="table-dark">
              <tr>
                <th>Id</th>
                <th>Picture</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Properties Sold</th>
                <th>Properties Under</th>
                <th>Rating</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {agents.map((agent, index) => (
                <tr key={agent._id}>
                  <td>{index + 1}</td>
                  <td>
                    <img
                      src={getImageUrl(agent.picture)}
                      alt={agent.name}
                      className="rounded-circle"
                      style={{ width: "50px", height: "50px", objectFit: "cover" }}
                    />
                  </td>
                  <td>{agent.name}</td>
                  <td>{agent.phone}</td>
                  <td>{agent.email}</td>
                  <td>{agent.propertiesSold}</td>
                  <td>{agent.propertiesUnder}</td>
                  <td>{agent.rating} / 5</td>
                  <td>
                    <button
                      className="btn btn-warning btn-sm me-1"
                      onClick={() => {
                        setEditMode(true);
                        setCurrentAgent(agent);
                        setImagePreview(getImageUrl(agent.picture));
                        setShowModal(true);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(agent._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Agent Form Modal */}
      {showModal && (
        <div className="modal show fade d-block" tabIndex="-1">
          <div className="modal-dialog modal-lg modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editMode ? "Edit Agent" : "Add Agent"}
                </h5>
                <button
                  className="btn-close"
                  onClick={resetForm}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                    placeholder="Full Name"
                    value={currentAgent.name || ""}
                    onChange={(e) =>
                      setCurrentAgent({
                        ...currentAgent,
                        name: e.target.value,
                      })
                    }
                  />
                  {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                </div>
                <div className="mb-3">
                  <label className="form-label">Phone</label>
                  <input
                    type="text"
                    className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                    placeholder="Phone Number"
                    value={currentAgent.phone || ""}
                    onChange={(e) =>
                      setCurrentAgent({
                        ...currentAgent,
                        phone: e.target.value,
                      })
                    }
                  />
                  {errors.phone && (
                    <div className="invalid-feedback">{errors.phone}</div>
                  )}
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    placeholder="Email Address"
                    value={currentAgent.email || ""}
                    onChange={(e) =>
                      setCurrentAgent({
                        ...currentAgent,
                        email: e.target.value,
                      })
                    }
                  />
                  {errors.email && (
                    <div className="invalid-feedback">{errors.email}</div>
                  )}
                </div>
                <div className="row">
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Properties Sold</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="0"
                      value={currentAgent.propertiesSold || 0}
                      onChange={(e) =>
                        setCurrentAgent({
                          ...currentAgent,
                          propertiesSold: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Properties Under Contract</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="0"
                      value={currentAgent.propertiesUnder || 0}
                      onChange={(e) =>
                        setCurrentAgent({
                          ...currentAgent,
                          propertiesUnder: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Rating (0-5)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      className="form-control"
                      placeholder="0.0"
                      value={currentAgent.rating || 0}
                      onChange={(e) =>
                        setCurrentAgent({
                          ...currentAgent,
                          rating: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Office Address</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Office Address"
                    value={currentAgent.officeAddress || ""}
                    onChange={(e) =>
                      setCurrentAgent({
                        ...currentAgent,
                        officeAddress: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    placeholder="Agent Description"
                    value={currentAgent.description || ""}
                    onChange={(e) =>
                      setCurrentAgent({
                        ...currentAgent,
                        description: e.target.value,
                      })
                    }
                  ></textarea>
                </div>
                <div className="mb-3">
                  <label className="form-label">Upload Picture</label>
                  <input
                    type="file"
                    className={`form-control ${errors.picture ? 'is-invalid' : ''}`}
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setImageFile(file);
                        setImagePreview(URL.createObjectURL(file));
                      }
                    }}
                  />
                  {errors.picture && (
                    <div className="invalid-feedback">{errors.picture}</div>
                  )}
                </div>
                {imagePreview && (
                  <div className="mb-3">
                    <label className="form-label">Image Preview</label>
                    <div className="text-center">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="img-fluid rounded"
                        style={{ maxHeight: "200px" }}
                      />
                    </div>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={resetForm}
                >
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={handleSubmit}>
                  {editMode ? "Save Changes" : "Add Agent"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Agents;