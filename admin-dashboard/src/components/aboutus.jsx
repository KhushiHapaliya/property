import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./aboutus.css";

const AboutUs = () => {
  const [aboutData, setAboutData] = useState([
    {
      id: 1,
      picture1: require("./images/about1.jpg"),
      picture2: require("./images/about2.jpg"),
      message: "We are committed to delivering the best real estate services with integrity and professionalism.",
    },
    {
      id: 2,
      picture1: require("./images/about3.jpg"),
      picture2: require("./images/about4.jpg"),
      message: "Our mission is to make property buying and selling easy and hassle-free for everyone.",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentData, setCurrentData] = useState({});
  const [errors, setErrors] = useState({});
  const [imagePreview1, setImagePreview1] = useState("");
  const [imagePreview2, setImagePreview2] = useState("");

  // Validation
  const validate = (data) => {
    const newErrors = {};
    if (!data.message) newErrors.message = "Message is required";
    if (!data.picture1) newErrors.picture1 = "Picture 1 is required";
    if (!data.picture2) newErrors.picture2 = "Picture 2 is required";
    return newErrors;
  };

  // Submit Handler
  const handleSubmit = () => {
    const validationErrors = validate(currentData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (editMode) {
      setAboutData(aboutData.map((item) => (item.id === currentData.id ? currentData : item)));
    } else {
      setAboutData([
        ...aboutData,
        { ...currentData, id: aboutData.length + 1 },
      ]);
    }

    setShowModal(false);
    setCurrentData({});
    setImagePreview1("");
    setImagePreview2("");
    setErrors({});
  };

  // Delete Handler
  const handleDelete = (id) => setAboutData(aboutData.filter((item) => item.id !== id));

  // Input Handlers
  const handleChange = (e) => setCurrentData({ ...currentData, message: e.target.value });

  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      if (type === "picture1") {
        setImagePreview1(url);
        setCurrentData({ ...currentData, picture1: url });
      } else {
        setImagePreview2(url);
        setCurrentData({ ...currentData, picture2: url });
      }
    }
  };

  return (
    <div className="container-fluid py-4">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-10">
          <div className="card shadow-sm">
            <div className="card-header bg-light">
              <div className="d-flex justify-content-between align-items-center flex-wrap">
                <h2 className="mb-0 py-2">About Us Management</h2>
                <button
                  className="btn btn-success"
                  onClick={() => {
                    setEditMode(false);
                    setCurrentData({});
                    setImagePreview1("");
                    setImagePreview2("");
                    setShowModal(true);
                  }}
                >
                  <i className="bi bi-plus-circle me-2"></i>Add Content
                </button>
              </div>
            </div>
            <div className="card-body">
              {/* Responsive Table Layout */}
              <div className="table-responsive">
                <table className="table table-hover custom-table">
                  <thead className="table-dark">
                    <tr>
                      <th scope="col" className="d-none d-sm-table-cell">ID</th>
                      <th scope="col">Picture 1</th>
                      <th scope="col">Picture 2</th>
                      <th scope="col">Message</th>
                      <th scope="col">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {aboutData.map((item, index) => (
                      <tr key={item.id}>
                        <td className="d-none d-sm-table-cell">{index + 1}</td>
                        <td>
                          <img
                            src={item.picture1}
                            alt={`About ${item.id} Pic 1`}
                            className="rounded-img img-fluid"
                          />
                        </td>
                        <td>
                          <img
                            src={item.picture2}
                            alt={`About ${item.id} Pic 2`}
                            className="rounded-img img-fluid"
                          />
                        </td>
                        <td className="message-cell">{item.message}</td>
                        <td>
                          <div className="d-flex flex-column flex-sm-row gap-2">
                            <button
                              className="btn btn-warning btn-sm"
                              onClick={() => {
                                setEditMode(true);
                                setCurrentData(item);
                                setImagePreview1(item.picture1);
                                setImagePreview2(item.picture2);
                                setShowModal(true);
                              }}
                            >
                              <i className="bi bi-pencil me-1 d-none d-sm-inline"></i>Edit
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleDelete(item.id)}
                            >
                              <i className="bi bi-trash me-1 d-none d-sm-inline"></i>Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {aboutData.length === 0 && (
                <div className="text-center p-4">
                  <p className="text-muted">No content available. Click "Add Content" to get started.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Add/Edit with Bootstrap Modal Classes */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal show fade d-block" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{editMode ? "Edit Content" : "Add Content"}</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body">
                  <div className="container-fluid px-0">
                    <div className="row">
                      <div className="col-12">
                        <div className="mb-3">
                          <label htmlFor="message" className="form-label">Message</label>
                          <textarea
                            id="message"
                            name="message"
                            placeholder="Enter your message here"
                            value={currentData.message || ""}
                            onChange={handleChange}
                            className={`form-control ${errors.message ? 'is-invalid' : ''}`}
                            rows={3}
                          ></textarea>
                          {errors.message && <div className="invalid-feedback">{errors.message}</div>}
                        </div>
                      </div>
                    </div>
                    
                    <div className="row">
                      <div className="col-12 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Upload Picture 1:</label>
                          <input 
                            type="file" 
                            className={`form-control ${errors.picture1 ? 'is-invalid' : ''}`} 
                            onChange={(e) => handleImageChange(e, "picture1")} 
                          />
                          {errors.picture1 && <div className="invalid-feedback">{errors.picture1}</div>}
                          {imagePreview1 && (
                            <div className="mt-2">
                              <img src={imagePreview1} alt="Preview 1" className="img-preview img-fluid" />
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="col-12 col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Upload Picture 2:</label>
                          <input 
                            type="file" 
                            className={`form-control ${errors.picture2 ? 'is-invalid' : ''}`} 
                            onChange={(e) => handleImageChange(e, "picture2")} 
                          />
                          {errors.picture2 && <div className="invalid-feedback">{errors.picture2}</div>}
                          {imagePreview2 && (
                            <div className="mt-2">
                              <img src={imagePreview2} alt="Preview 2" className="img-preview img-fluid" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="button" className="btn btn-primary" onClick={handleSubmit}>
                    {editMode ? "Save Changes" : "Add Content"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AboutUs;