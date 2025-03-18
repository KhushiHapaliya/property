import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./properties.css";

const Properties = () => {
  const [properties, setProperties] = useState([
    {
      id: 1,
      title: "Luxury Villa in Beverly Hills",
      type: "Villa",
      location: "Beverly Hills, CA",
      price: 2500000,
      area: 5000,
      bedrooms: 5,
      bathrooms: 4,
      status: "Available",
      description: "A luxurious villa with modern amenities.",
      picture: require("./images/property1.jpg"),
    },
    {
      id: 2,
      title: "Modern Apartment in New York",
      type: "Apartment",
      location: "Manhattan, NY",
      price: 950000,
      area: 1500,
      bedrooms: 3,
      bathrooms: 2,
      status: "Sold",
      description: "A stylish apartment in the heart of NYC.",
      picture: require("./images/property2.jpg"),
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentProperty, setCurrentProperty] = useState({});
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState("");

  const validate = (property) => {
    const newErrors = {};
    if (!property.title) newErrors.title = "Title is required";
    if (!property.type) newErrors.type = "Type is required";
    if (!property.location) newErrors.location = "Location is required";
    if (!property.price || property.price < 0)
      newErrors.price = "Valid price is required";
    if (!property.area || property.area < 0)
      newErrors.area = "Valid area is required";
    if (!property.bedrooms || property.bedrooms < 0)
      newErrors.bedrooms = "Valid number of bedrooms required";
    if (!property.bathrooms || property.bathrooms < 0)
      newErrors.bathrooms = "Valid number of bathrooms required";
    if (!property.status) newErrors.status = "Status is required";
    if (!property.description) newErrors.description = "Description is required";
    if (!property.picture) newErrors.picture = "Picture is required";
    return newErrors;
  };

  const handleSubmit = () => {
    const validationErrors = validate(currentProperty);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (editMode) {
      setProperties(
        properties.map((p) =>
          p.id === currentProperty.id ? currentProperty : p
        )
      );
    } else {
      setProperties([...properties, { ...currentProperty, id: properties.length + 1 }]);
    }

    setShowModal(false);
    setCurrentProperty({});
    setImagePreview("");
    setErrors({});
  };

  const handleDelete = (id) => {
    setProperties(properties.filter((p) => p.id !== id));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentProperty({ ...currentProperty, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
      setCurrentProperty({ ...currentProperty, picture: url });
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Properties Management</h1>

      <div className="d-flex justify-content-center justify-content-md-end mb-3">
        <button
          className="btn btn-success btn-sm"
          onClick={() => {
            setEditMode(false);
            setCurrentProperty({});
            setImagePreview("");
            setShowModal(true);
          }}
        >
          + Add Property
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-hover table-bordered mb-0">
          <thead className="table-dark">
            <tr>
              <th>Id</th>
              <th>Picture</th>
              <th>Title</th>
              <th>Type</th>
              <th>Location</th>
              <th>Price</th>
              <th>Area (sq ft)</th>
              <th>Bedrooms</th>
              <th>Bathrooms</th>
              <th>Status</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {properties.map((property, index) => (
              <tr key={property.id}>
                <td>{index + 1}</td>
                <td>
                  <img
                    src={property.picture}
                    alt={property.title}
                    className="img-thumbnail"
                  />
                </td>
                <td>{property.title}</td>
                <td>{property.type}</td>
                <td>{property.location}</td>
                <td>${property.price.toLocaleString()}</td>
                <td>{property.area}</td>
                <td>{property.bedrooms}</td>
                <td>{property.bathrooms}</td>
                <td>{property.status}</td>
                <td>{property.description}</td>
                <td>
                  <button
                    className="btn btn-warning btn-sm me-1 mb-1"
                    onClick={() => {
                      setEditMode(true);
                      setCurrentProperty(property);
                      setImagePreview(property.picture);
                      setShowModal(true);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm mb-1"
                    onClick={() => handleDelete(property.id)}
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
                  {editMode ? "Edit Property" : "Add Property"}
                </h5>
                <button
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body row g-3">
                {[
                  "title",
                  "type",
                  "location",
                  "price",
                  "area",
                  "bedrooms",
                  "bathrooms",
                  "status",
                  "description",
                ].map((field, idx) => (
                  <div className="col-12 col-md-6" key={idx}>
                    <input
                      type={
                        ["price", "area", "bedrooms", "bathrooms"].includes(field)
                          ? "number"
                          : "text"
                      }
                      name={field}
                      placeholder={
                        field.charAt(0).toUpperCase() + field.slice(1)
                      }
                      value={currentProperty[field] || ""}
                      onChange={handleChange}
                      className="form-control"
                    />
                    {errors[field] && (
                      <div className="text-danger small">{errors[field]}</div>
                    )}
                  </div>
                ))}
                <div className="col-12">
                  <label>Upload Picture:</label>
                  <input
                    type="file"
                    className="form-control"
                    onChange={handleImageChange}
                  />
                  {errors.picture && (
                    <div className="text-danger small">{errors.picture}</div>
                  )}
                </div>
                {imagePreview && (
                  <div className="col-12">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="img-fluid rounded mt-3"
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
