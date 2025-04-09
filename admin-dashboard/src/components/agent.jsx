import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const Agents = () => {
  const [agents, setAgents] = useState([
    {
      id: 1,
      name: "David Johnson",
      phone: "123-456-7890",
      email: "david.johnson@example.com",
      propertiesSold: 20,
      propertiesUnder: 10,
      rating: 4.5,
      officeAddress: "123 Main Office, NY",
      description: "Experienced agent with 10 years in real estate.",
      picture: require("./images/agent3.jpg"),
    },
    {
      id: 2,
      name: "Sarah Parker",
      phone: "987-654-3210",
      email: "sarah.parker@example.com",
      propertiesSold: 15,
      propertiesUnder: 8,
      rating: 4.7,
      officeAddress: "456 Maple Office, LA",
      description: "Specialist in luxury properties.",
      picture: require("./images/agent2.jpg"),
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentAgent, setCurrentAgent] = useState({});
  const [viewAgent, setViewAgent] = useState({});
  const [errors, setErrors] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const validate = (agent) => {
    const newErrors = {};
    if (!agent.name) newErrors.name = "Name is required";
    if (!agent.phone) newErrors.phone = "Phone is required";
    if (!agent.email || !/\S+@\S+\.\S+/.test(agent.email))
      newErrors.email = "Valid email is required";
    if (!editMode && !imageFile) newErrors.picture = "Picture is required";
    return newErrors;
  };

  const handleSubmit = () => {
    const validationErrors = validate(currentAgent);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const agentData = {
      ...currentAgent,
      picture: imageFile ? URL.createObjectURL(imageFile) : currentAgent.picture,
    };

    if (editMode) {
      setAgents(agents.map((a) => (a.id === currentAgent.id ? agentData : a)));
    } else {
      setAgents([...agents, { ...agentData, id: agents.length + 1 }]);
    }

    setShowModal(false);
    setCurrentAgent({});
    setImageFile(null);
    setImagePreview("");
    setErrors({});
  };

  const handleViewDetails = (agent) => {
    setViewAgent(agent);
    setShowViewModal(true);
  };

  return (
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