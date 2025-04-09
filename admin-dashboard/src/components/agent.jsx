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
    <div className="container-fluid py-5 bg-light">
      <h2 className="text-center fw-bold mb-4 text-dark">Agent Management</h2>
      <div className="row mb-4">
        <div className="col-12 text-end">
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
      <div className="table-responsive">
        <table className="table table-hover border bg-white shadow-sm rounded overflow-hidden">
          <thead className="bg-dark text-white">
            <tr>
              <th className="py-3">Id</th>
              <th className="py-3">Picture</th>
              <th className="py-3">Name</th>
              <th className="py-3">Phone</th>
              <th className="py-3">Email</th>
              <th className="py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {agents.map((agent, index) => (
              <tr key={agent.id} className="align-middle">
                <td>{index + 1}</td>
                <td>
                  <img
                    src={agent.picture}
                    alt={agent.name}
                    className="rounded-circle border"
                    style={{ width: "50px", height: "50px", objectFit: "cover" }}
                  />
                </td>
                <td className="fw-medium">{agent.name}</td>
                <td>{agent.phone}</td>
                <td>{agent.email}</td>
                <td>
                  <div className="btn-group">
                    <button
                      className="btn btn-primary btn-sm me-1"
                      onClick={() => handleViewDetails(agent)}
                    >
                      <i className="bi bi-eye me-1"></i>View
                    </button>
                    <button
                      className="btn btn-warning btn-sm me-1 text-white"
                      onClick={() => {
                        setEditMode(true);
                        setCurrentAgent(agent);
                        setImagePreview(agent.picture);
                        setShowModal(true);
                      }}
                    >
                      <i className="bi bi-pencil me-1"></i>Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() =>
                        setAgents(agents.filter((a) => a.id !== agent.id))
                      }
                    >
                      <i className="bi bi-trash me-1"></i>Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
        <>
          <div className="modal-backdrop fade show"></div>
          <div className="modal fade show d-block" tabIndex="-1" style={{ backdropFilter: "blur(4px)" }}>
            <div className="modal-dialog modal-lg modal-dialog-scrollable modal-dialog-centered">
              <div className="modal-content border-0 rounded-4 shadow">
                <div className="modal-header bg-dark text-white border-0 rounded-top-4 py-3">
                  <h5 className="modal-title fw-medium">
                    {editMode ? "Edit Agent" : "Add Agent"}
                  </h5>
                  <button
                    className="btn-close btn-close-white"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <input
                      type="text"
                      className={`form-control py-3 rounded-3 ${errors.name ? 'is-invalid' : ''}`}
                      placeholder="Name"
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
                    <input
                      type="text"
                      className={`form-control py-3 rounded-3 ${errors.phone ? 'is-invalid' : ''}`}
                      placeholder="Phone"
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
                    <input
                      type="email"
                      className={`form-control py-3 rounded-3 ${errors.email ? 'is-invalid' : ''}`}
                      placeholder="Email"
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
                  <div className="row mb-3">
                    <div className="col-md-6 mb-3 mb-md-0">
                      <input
                        type="number"
                        className="form-control py-3 rounded-3"
                        placeholder="Properties Sold"
                        value={currentAgent.propertiesSold || ""}
                        onChange={(e) =>
                          setCurrentAgent({
                            ...currentAgent,
                            propertiesSold: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="col-md-6">
                      <input
                        type="number"
                        className="form-control py-3 rounded-3"
                        placeholder="Properties Under Contract"
                        value={currentAgent.propertiesUnder || ""}
                        onChange={(e) =>
                          setCurrentAgent({
                            ...currentAgent,
                            propertiesUnder: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-6 mb-3 mb-md-0">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="5"
                        className="form-control py-3 rounded-3"
                        placeholder="Rating (0-5)"
                        value={currentAgent.rating || ""}
                        onChange={(e) =>
                          setCurrentAgent({
                            ...currentAgent,
                            rating: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="col-md-6">
                      <input
                        type="text"
                        className="form-control py-3 rounded-3"
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
                  </div>
                  <div className="mb-3">
                    <textarea
                      className="form-control py-3 rounded-3"
                      placeholder="Description"
                      rows="3"
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
                    <label className="form-label">Upload Picture:</label>
                    <input
                      type="file"
                      className={`form-control py-3 rounded-3 ${errors.picture ? 'is-invalid' : ''}`}
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
                    <div className="mb-3 text-center">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="img-fluid rounded-3 border"
                        style={{ maxWidth: "150px" }}
                      />
                    </div>
                  )}
                </div>
                <div className="modal-footer border-0 p-3 d-flex justify-content-between">
                  <button
                    className="btn btn-secondary py-2 px-4 rounded-3"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    className="btn btn-primary py-2 px-4 rounded-3 fw-medium"
                    onClick={handleSubmit}
                  >
                    {editMode ? "Save Changes" : "Add Agent"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* View Agent Details Modal */}
      {showViewModal && (
        <>
          <div className="modal-backdrop fade show"></div>
          <div className="modal fade show d-block" tabIndex="-1" style={{ backdropFilter: "blur(4px)" }}>
            <div className="modal-dialog modal-lg modal-dialog-scrollable modal-dialog-centered">
              <div className="modal-content border-0 rounded-4 shadow">
                <div className="modal-header bg-primary text-white border-0 rounded-top-4 py-3">
                  <h5 className="modal-title fw-medium">Agent Details</h5>
                  <button
                    className="btn-close btn-close-white"
                    onClick={() => setShowViewModal(false)}
                  ></button>
                </div>
                <div className="modal-body p-4">
                  <div className="row">
                    <div className="col-md-4 text-center mb-4 mb-md-0">
                      <img
                        src={viewAgent.picture}
                        alt={viewAgent.name}
                        className="rounded-circle border img-fluid shadow"
                        style={{ width: "200px", height: "200px", objectFit: "cover" }}
                      />
                      <div className="mt-3">
                        <h4 className="fw-bold">{viewAgent.name}</h4>
                        <div className="badge bg-success mb-2 py-2 px-3">
                          Rating: {viewAgent.rating} / 5
                        </div>
                      </div>
                    </div>
                    <div className="col-md-8">
                      <div className="card border-0 shadow-sm">
                        <div className="card-body">
                          <h5 className="card-title fw-bold mb-3">Contact Information</h5>
                          <div className="mb-3">
                            <p className="mb-1"><strong>Phone:</strong></p>
                            <p className="text-primary"><i className="bi bi-telephone me-2"></i>{viewAgent.phone}</p>
                          </div>
                          <div className="mb-3">
                            <p className="mb-1"><strong>Email:</strong></p>
                            <p className="text-primary"><i className="bi bi-envelope me-2"></i>{viewAgent.email}</p>
                          </div>
                          <div className="mb-3">
                            <p className="mb-1"><strong>Office Address:</strong></p>
                            <p><i className="bi bi-geo-alt me-2"></i>{viewAgent.officeAddress}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="card border-0 shadow-sm mt-3">
                        <div className="card-body">
                          <h5 className="card-title fw-bold mb-3">Performance</h5>
                          <div className="row text-center">
                            <div className="col-6">
                              <div className="p-3 bg-light rounded">
                                <h3 className="text-success fw-bold">{viewAgent.propertiesSold}</h3>
                                <p className="mb-0 text-muted">Properties Sold</p>
                              </div>
                            </div>
                            <div className="col-6">
                              <div className="p-3 bg-light rounded">
                                <h3 className="text-primary fw-bold">{viewAgent.propertiesUnder}</h3>
                                <p className="mb-0 text-muted">Under Contract</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="card border-0 shadow-sm mt-4">
                    <div className="card-body">
                      <h5 className="card-title fw-bold mb-3">About</h5>
                      <p className="mb-0">{viewAgent.description}</p>
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-0 p-3">
                  <button
                    className="btn btn-secondary py-2 px-4 rounded-3"
                    onClick={() => setShowViewModal(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Agents;