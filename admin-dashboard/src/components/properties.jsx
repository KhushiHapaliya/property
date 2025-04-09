import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./properties.css";

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentProperty, setCurrentProperty] = useState({
    title: "",
    type: "",
    location: "",
    price: "",
    area: "",
    bedrooms: "",
    bathrooms: "",
    status: "Available",
    description: "",
  });
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  // Fetch properties on component mount
  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      // Make sure we're using the correct API endpoint path
      const response = await axios.get("/api/properties");
      setProperties(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch properties. Please try again later.");
      console.error("Error fetching properties:", err);
    } finally {
      setLoading(false);
    }
  };

  const validate = (property) => {
    const newErrors = {};
    if (!property.title) newErrors.title = "Title is required";
    if (!property.type) newErrors.type = "Type is required";
    if (!property.location) newErrors.location = "Location is required";
    if (!property.price || property.price <= 0)
      newErrors.price = "Valid price is required";
    if (!property.area || property.area <= 0)
      newErrors.area = "Valid area is required";
    if (!property.bedrooms || property.bedrooms < 0)
      newErrors.bedrooms = "Valid number of bedrooms required";
    if (!property.bathrooms || property.bathrooms < 0)
      newErrors.bathrooms = "Valid number of bathrooms required";
    if (!property.status) newErrors.status = "Status is required";
    if (!property.description) newErrors.description = "Description is required";
    
    // Make picture optional for edit mode
    if (!editMode && !selectedFile && !property.picture) {
      newErrors.picture = "Picture is required";
    }
    return newErrors;
  };

  const handleSubmit = async () => {
    try {
      const validationErrors = validate(currentProperty);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      // Create FormData for file upload
      const formData = new FormData();
      
      // Append all property fields to formData
      Object.keys(currentProperty).forEach(key => {
        if (key !== 'picture' || !selectedFile) { // Don't append picture if a new file is selected
          formData.append(key, currentProperty[key]);
        }
      });
      
      // Append file if selected
      if (selectedFile) {
        formData.append('propertyImage', selectedFile);
      }

      let response;
      if (editMode) {
        response = await axios.put(`/api/properties/${currentProperty._id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        setProperties(properties.map(p => 
          p._id === currentProperty._id ? response.data : p
        ));
      } else {
        response = await axios.post("/api/properties", formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        setProperties([...properties, response.data]);
      }

      setShowModal(false);
      resetForm();
    } catch (err) {
      setError("Failed to save property. Please try again.");
      console.error("Error saving property:", err);
    }
  };

  const resetForm = () => {
    setCurrentProperty({
      title: "",
      type: "",
      location: "",
      price: "",
      area: "",
      bedrooms: "",
      bathrooms: "",
      status: "Available",
      description: "",
    });
    setSelectedFile(null);
    setImagePreview("");
    setErrors({});
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this property?")) {
      try {
        await axios.delete(`/api/properties/${id}`);
        setProperties(properties.filter(p => p._id !== id));
      } catch (err) {
        setError("Failed to delete property. Please try again.");
        console.error("Error deleting property:", err);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentProperty({ 
      ...currentProperty, 
      [name]: ["price", "area", "bedrooms", "bathrooms"].includes(name) ? Number(value) : value
    });
    
    // Clear the specific error when user starts typing
    if (errors[name]) {
      setErrors({...errors, [name]: null});
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setImagePreview(url);
      
      // Clear picture error if it exists
      if (errors.picture) {
        setErrors({...errors, picture: null});
      }
    }
  };
  
  const handleAddNewProperty = () => {
    setEditMode(false);
    resetForm();
    setShowModal(true);
  };

  const handleEdit = (property) => {
    setEditMode(true);
    setCurrentProperty({...property});
    // For server images, use full URL
    if (property.picture) {
      setImagePreview(property.picture.startsWith('http') ? property.picture : `/public${property.picture}`);
    } else {
      setImagePreview("");
    }
    setShowModal(true);
  };

  // Show loading indicator
  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading properties...</p>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Properties Management</h1>

      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {error}
          <button type="button" className="btn-close" onClick={() => setError(null)}></button>
        </div>
      )}

      <div className="d-flex justify-content-center justify-content-md-end mb-3">
        <button
          className="btn btn-success"
          onClick={handleAddNewProperty}
        >
          + Add Property
        </button>
      </div>

      {properties.length === 0 ? (
        <div className="alert alert-info">
          No properties available. Add your first property!
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover table-bordered mb-0">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Picture</th>
                <th>Title</th>
                <th>Type</th>
                <th>Location</th>
                <th>Price</th>
                <th>Area (sq ft)</th>
                <th>Bedrooms</th>
                <th>Bathrooms</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((property, index) => (
                <tr key={property._id}>
                  <td>{index + 1}</td>
                  <td>
                    {property.picture && (
                      <img
                        src={property.picture.startsWith("http") ? property.picture : `http://localhost:5000${property.picture}`}
                        alt={property.title}
                        className="img-thumbnail"
                        style={{ width: "100px", height: "75px", objectFit: "cover" }}
                        onError={(e) => {
                          e.target.src = "/public/images/property-placeholder.jpg";
                        }}
                      />
                    )}
                  </td>
                  <td>{property.title}</td>
                  <td>{property.type}</td>
                  <td>{property.location}</td>
                  <td>${property.price.toLocaleString()}</td>
                  <td>{property.area}</td>
                  <td>{property.bedrooms}</td>
                  <td>{property.bathrooms}</td>
                  <td>
                    <span className={`badge ${property.status === 'Available' ? 'bg-success' : 
                                              property.status === 'Sold' ? 'bg-danger' : 
                                              property.status === 'Pending' ? 'bg-warning' : 'bg-info'}`}>
                      {property.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-info me-1 mb-1"
                      onClick={() => window.open(`/property/${property._id}`, '_blank')}
                      title="View Details"
                    >
                      View
                    </button>
                    <button
                      className="btn btn-warning btn-sm me-1 mb-1"
                      onClick={() => handleEdit(property)}
                      title="Edit Property"
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm mb-1"
                      onClick={() => handleDelete(property._id)}
                      title="Delete Property"
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

      {showModal && (
        <div className="modal show fade d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editMode ? "Edit Property" : "Add Property"}
                </h5>
                <button
                  className="btn-close"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Title</label>
                    <input
                      type="text"
                      name="title"
                      placeholder="Property Title"
                      value={currentProperty.title || ""}
                      onChange={handleChange}
                      className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                    />
                    {errors.title && (
                      <div className="invalid-feedback">{errors.title}</div>
                    )}
                  </div>
                  
                  <div className="col-md-6">
                    <label className="form-label">Type</label>
                    <select
                      name="type"
                      value={currentProperty.type || ""}
                      onChange={handleChange}
                      className={`form-select ${errors.type ? 'is-invalid' : ''}`}
                    >
                      <option value="">Select Type</option>
                      <option value="House">House</option>
                      <option value="Apartment">Apartment</option>
                      <option value="Villa">Villa</option>
                      <option value="Land">Land</option>
                      <option value="Commercial">Commercial</option>
                    </select>
                    {errors.type && (
                      <div className="invalid-feedback">{errors.type}</div>
                    )}
                  </div>
                  
                  <div className="col-md-6">
                    <label className="form-label">Location</label>
                    <input
                      type="text"
                      name="location"
                      placeholder="City, State"
                      value={currentProperty.location || ""}
                      onChange={handleChange}
                      className={`form-control ${errors.location ? 'is-invalid' : ''}`}
                    />
                    {errors.location && (
                      <div className="invalid-feedback">{errors.location}</div>
                    )}
                  </div>
                  
                  <div className="col-md-6">
                    <label className="form-label">Price ($)</label>
                    <input
                      type="number"
                      name="price"
                      placeholder="Price"
                      value={currentProperty.price || ""}
                      onChange={handleChange}
                      className={`form-control ${errors.price ? 'is-invalid' : ''}`}
                    />
                    {errors.price && (
                      <div className="invalid-feedback">{errors.price}</div>
                    )}
                  </div>
                  
                  <div className="col-md-4">
                    <label className="form-label">Area (sq ft)</label>
                    <input
                      type="number"
                      name="area"
                      placeholder="Area"
                      value={currentProperty.area || ""}
                      onChange={handleChange}
                      className={`form-control ${errors.area ? 'is-invalid' : ''}`}
                    />
                    {errors.area && (
                      <div className="invalid-feedback">{errors.area}</div>
                    )}
                  </div>
                  
                  <div className="col-md-4">
                    <label className="form-label">Bedrooms</label>
                    <input
                      type="number"
                      name="bedrooms"
                      placeholder="Bedrooms"
                      value={currentProperty.bedrooms || ""}
                      onChange={handleChange}
                      className={`form-control ${errors.bedrooms ? 'is-invalid' : ''}`}
                    />
                    {errors.bedrooms && (
                      <div className="invalid-feedback">{errors.bedrooms}</div>
                    )}
                  </div>
                  
                  <div className="col-md-4">
                    <label className="form-label">Bathrooms</label>
                    <input
                      type="number"
                      name="bathrooms"
                      placeholder="Bathrooms"
                      value={currentProperty.bathrooms || ""}
                      onChange={handleChange}
                      className={`form-control ${errors.bathrooms ? 'is-invalid' : ''}`}
                    />
                    {errors.bathrooms && (
                      <div className="invalid-feedback">{errors.bathrooms}</div>
                    )}
                  </div>
                  
                  <div className="col-md-6">
                    <label className="form-label">Status</label>
                    <select
                      name="status"
                      value={currentProperty.status || "Available"}
                      onChange={handleChange}
                      className={`form-select ${errors.status ? 'is-invalid' : ''}`}
                    >
                      <option value="Available">Available</option>
                      <option value="Sold">Sold</option>
                      <option value="Pending">Pending</option>
                      <option value="Rented">Rented</option>
                    </select>
                    {errors.status && (
                      <div className="invalid-feedback">{errors.status}</div>
                    )}
                  </div>
                  
                  <div className="col-md-6">
                    <label className="form-label">Property Picture</label>
                    <input
                      type="file"
                      name="propertyImage"
                      className={`form-control ${errors.picture ? 'is-invalid' : ''}`}
                      onChange={handleImageChange}
                      accept="image/*"
                    />
                    {errors.picture && (
                      <div className="invalid-feedback">{errors.picture}</div>
                    )}
                  </div>
                  
                  <div className="col-12">
                    <label className="form-label">Description</label>
                    <textarea
                      name="description"
                      placeholder="Property Description"
                      value={currentProperty.description || ""}
                      onChange={handleChange}
                      className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                      rows="3"
                    ></textarea>
                    {errors.description && (
                      <div className="invalid-feedback">{errors.description}</div>
                    )}
                  </div>
                  
                  {imagePreview && (
                    <div className="col-12 mt-3">
                      <label className="form-label">Image Preview</label>
                      <div className="text-center">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="img-fluid rounded"
                          style={{ maxHeight: "200px" }}
                          onError={(e) => {
                            e.target.src = "/public/images/property-placeholder.jpg";
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                >
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={handleSubmit}>
                  {editMode ? "Save Changes" : "Add Property"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Properties;