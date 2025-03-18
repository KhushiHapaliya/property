import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./agent.css";

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
  const [editMode, setEditMode] = useState(false);
  const [currentAgent, setCurrentAgent] = useState({});
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

  return (
    <div className="container-fluid mt-5">
      <h2 className="text-center mb-4">Agent Management</h2>
      <div className="row mb-3">
        <div className="col-12 col-md-4 offset-md-8 d-flex justify-content-end">
          <button
            className="btn btn-success w-100 w-md-auto"
            onClick={() => {
              setEditMode(false);
              setCurrentAgent({});
              setImageFile(null);
              setImagePreview("");
              setShowModal(true);
            }}
          >
            + Add Agent
          </button>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-hover table-bordered">
          <thead className="table-dark">
            <tr>
              <th>Id</th>
              <th>Picture</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {agents.map((agent, index) => (
              <tr key={agent.id}>
                <td>{index + 1}</td>
                <td>
                  <img
                    src={agent.picture}
                    alt={agent.name}
                    className="rounded-circle"
                    style={{ width: "50px", height: "50px", objectFit: "cover" }}
                  />
                </td>
                <td>{agent.name}</td>
                <td>{agent.phone}</td>
                <td>{agent.email}</td>
                <td>
                  <button
                    className="btn btn-warning btn-sm me-1"
                    onClick={() => {
                      setEditMode(true);
                      setCurrentAgent(agent);
                      setImagePreview(agent.picture);
                      setShowModal(true);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() =>
                      setAgents(agents.filter((a) => a.id !== agent.id))
                    }
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Name"
                    value={currentAgent.name || ""}
                    onChange={(e) =>
                      setCurrentAgent({
                        ...currentAgent,
                        name: e.target.value,
                      })
                    }
                  />
                  {errors.name && <div className="text-danger">{errors.name}</div>}
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
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
                    <div className="text-danger">{errors.phone}</div>
                  )}
                </div>
                <div className="mb-3">
                  <input
                    type="email"
                    className="form-control"
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
                    <div className="text-danger">{errors.email}</div>
                  )}
                </div>
                <div className="mb-3">
                  <label>Upload Picture:</label>
                  <input
                    type="file"
                    className="form-control"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setImageFile(file);
                        setImagePreview(URL.createObjectURL(file));
                      }
                    }}
                  />
                  {errors.picture && (
                    <div className="text-danger">{errors.picture}</div>
                  )}
                </div>
                {imagePreview && (
                  <div className="mb-3">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="img-fluid rounded"
                    />
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
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
