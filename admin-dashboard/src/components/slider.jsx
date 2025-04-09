import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const Slider = () => {
  const [sliders, setSliders] = useState([
    {
      id: 1,
      title: "Luxury Beachfront Property",
      description: "Experience the ultimate beach lifestyle with our exclusive properties",
      imageName: "slider1.jpg",
      imagePreview: require("./images/slider1.jpg"),
      active: true
    },
    {
      id: 2,
      title: "Urban Living Redefined",
      description: "Modern apartments in the heart of downtown",
      imageName: "slider2.jpg",
      imagePreview: require("./images/slider2.jpg"),
      active: false
    },
    {
      id: 3,
      title: "Countryside Retreats",
      description: "Peaceful homes surrounded by nature",
      imageName: "slider3.jpg",
      imagePreview: require("./images/slider3.jpg"),
      active: false
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentSlider, setCurrentSlider] = useState({});
  const [viewSlider, setViewSlider] = useState({});
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState("");

  const validate = (slider) => {
    const newErrors = {};
    if (!slider.title) newErrors.title = "Title is required";
    if (!slider.description) newErrors.description = "Description is required";
    if (!slider.imagePreview && !imagePreview) newErrors.image = "Image is required";
    return newErrors;
  };

  const handleSubmit = () => {
    const validationErrors = validate(currentSlider);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (editMode) {
      setSliders(
        sliders.map((s) =>
          s.id === currentSlider.id ? currentSlider : s
        )
      );
    } else {
      setSliders([
        ...sliders, 
        { 
          ...currentSlider, 
          id: Math.max(...sliders.map(s => s.id), 0) + 1,
          imageName: currentSlider.imageName || "slider-image.jpg"
        }
      ]);
    }

    setShowModal(false);
    setCurrentSlider({});
    setImagePreview("");
    setErrors({});
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this slider?")) {
      setSliders(sliders.filter((s) => s.id !== id));
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentSlider({ 
      ...currentSlider, 
      [name]: type === "checkbox" ? checked : value 
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
      setCurrentSlider({ 
        ...currentSlider, 
        imagePreview: url,
        imageName: file.name
      });
    }
  };

  const handleView = (slider) => {
    setViewSlider(slider);
    setShowViewModal(true);
  };

  const toggleActive = (id) => {
    setSliders(sliders.map(slider => ({
      ...slider,
      active: slider.id === id ? true : false
    })));
  };

  return (
    <div className="container my-5">
      <h1 className="fw-bold text-center mb-4">Slider Management</h1>

      <div className="d-flex justify-content-center justify-content-md-end mb-3">
        <button
          className="btn btn-success rounded-pill px-4"
          style={{ minWidth: "150px" }}
          onClick={() => {
            setEditMode(false);
            setCurrentSlider({active: false});
            setImagePreview("");
            setShowModal(true);
          }}
        >
          + Add Slider
        </button>
      </div>

      <div className="table-responsive mt-4">
        <table className="table table-hover table-bordered">
          <thead className="table-dark">
            <tr className="text-center">
              <th>Id</th>
              <th>Image</th>
              <th>Title</th>
              <th>Description</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody className="align-middle text-center">
            {sliders.length > 0 ? (
              sliders.map((slider, index) => (
                <tr key={slider.id}>
                  <td>{index + 1}</td>
                  <td>
                    <img
                      src={slider.imagePreview}
                      alt={slider.title}
                      className="rounded"
                      style={{ width: "100px", height: "50px", objectFit: "cover" }}
                    />
                  </td>
                  <td>{slider.title}</td>
                  <td style={{ maxWidth: "250px" }}>{slider.description}</td>
                  <td>
                    <span 
                      className={`badge ${slider.active ? "bg-success" : "bg-secondary"}`}
                      style={{ cursor: "pointer" }}
                      onClick={() => toggleActive(slider.id)}
                    >
                      {slider.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>
                    <div className="btn-group">
                      <button
                        className="btn btn-info btn-sm rounded-start"
                        onClick={() => handleView(slider)}
                      >
                        View
                      </button>
                      <button
                        className="btn btn-warning btn-sm"
                        onClick={() => {
                          setEditMode(true);
                          setCurrentSlider(slider);
                          setImagePreview(slider.imagePreview);
                          setShowModal(true);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm rounded-end"
                        onClick={() => handleDelete(slider.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4">No sliders found. Add one!</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal show fade d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content rounded-3">
              <div className="modal-header bg-dark text-white border-0">
                <h5 className="modal-title fw-bold">
                  {editMode ? "Edit Slider" : "Add Slider"}
                </h5>
                <button
                  className="btn-close btn-close-white"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body row g-3">
                <div className="col-12">
                  <label className="form-label">Title:</label>
                  <input
                    type="text"
                    name="title"
                    placeholder="Enter slider title"
                    value={currentSlider.title || ""}
                    onChange={handleChange}
                    className="form-control rounded-2"
                  />
                  {errors.title && (
                    <div className="text-danger small mt-1">{errors.title}</div>
                  )}
                </div>
                
                <div className="col-12">
                  <label className="form-label">Description:</label>
                  <textarea
                    name="description"
                    placeholder="Enter slider description"
                    value={currentSlider.description || ""}
                    onChange={handleChange}
                    className="form-control rounded-2"
                    rows="3"
                  ></textarea>
                  {errors.description && (
                    <div className="text-danger small mt-1">{errors.description}</div>
                  )}
                </div>
                
                <div className="col-12">
                  <label className="form-label">Upload Image:</label>
                  <input
                    type="file"
                    className="form-control rounded-2"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  {errors.image && (
                    <div className="text-danger small mt-1">{errors.image}</div>
                  )}
                </div>
                
                {(imagePreview || currentSlider.imagePreview) && (
                  <div className="col-12">
                    <label className="form-label">Image Preview:</label>
                    <img
                      src={imagePreview || currentSlider.imagePreview}
                      alt="Preview"
                      className="img-fluid rounded mt-1"
                      style={{ maxHeight: "200px" }}
                    />
                  </div>
                )}
                
                <div className="col-12">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="active"
                      name="active"
                      checked={currentSlider.active || false}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="active">
                      Make this slider active (will deactivate other sliders)
                    </label>
                  </div>
                </div>
              </div>
              <div className="modal-footer d-flex justify-content-between">
                <button
                  className="btn btn-secondary rounded-pill"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button 
                  className="btn btn-primary rounded-pill" 
                  onClick={handleSubmit}
                  style={{ backgroundColor: "#236464", borderColor: "#236464" }}
                >
                  {editMode ? "Save Changes" : "Add Slider"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && (
        <div className="modal show fade d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content rounded-3">
              <div className="modal-header bg-dark text-white border-0">
                <h5 className="modal-title fw-bold">Slider Preview</h5>
                <button
                  className="btn-close btn-close-white"
                  onClick={() => setShowViewModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="position-relative">
                  <img
                    src={viewSlider.imagePreview}
                    alt={viewSlider.title}
                    className="img-fluid rounded w-100"
                    style={{ height: "400px", objectFit: "cover" }}
                  />
                  <div 
                    className="position-absolute bottom-0 start-0 w-100 p-4 text-white"
                    style={{ background: "linear-gradient(transparent, rgba(0,0,0,0.7))" }}
                  >
                    <h3 className="fw-bold">{viewSlider.title}</h3>
                    <p className="mb-0">{viewSlider.description}</p>
                  </div>
                </div>
                
                <div className="row mt-4">
                  <div className="col-md-6">
                    <p><strong>Filename:</strong> {viewSlider.imageName}</p>
                  </div>
                  <div className="col-md-6">
                    <p>
                      <strong>Status:</strong>{" "}
                      <span className={`badge ${viewSlider.active ? "bg-success" : "bg-secondary"}`}>
                        {viewSlider.active ? "Active" : "Inactive"}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary rounded-pill"
                  onClick={() => setShowViewModal(false)}
                >
                  Close
                </button>
                <button
                  className="btn btn-warning rounded-pill"
                  onClick={() => {
                    setShowViewModal(false);
                    setEditMode(true);
                    setCurrentSlider(viewSlider);
                    setImagePreview(viewSlider.imagePreview);
                    setShowModal(true);
                  }}
                >
                  Edit This Slider
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Slider;