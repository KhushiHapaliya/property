import React, { useState } from 'react';
import '../styles/MyProperties.css';

import property1 from './images/property1.jpg';
import property2 from './images/property2.jpg';
import property3 from './images/property3.jpg';

const initialProperties = [
  { id: 1, title: 'Luxury Apartment', location: 'New Delhi, India', price: '₹1.2 Cr', status: 'Available', image: property1 },
  { id: 2, title: 'Modern Villa', location: 'Mumbai, India', price: '₹2.5 Cr', status: 'Sold', image: property2 },
  { id: 3, title: 'Cozy Cottage', location: 'Shimla, India', price: '₹80 Lakh', status: 'Available', image: property3 },
];

const MyProperties = () => {
  const [properties, setProperties] = useState(initialProperties);
  const [modalType, setModalType] = useState(null);
  const [currentProperty, setCurrentProperty] = useState(null);
  const [formData, setFormData] = useState({ title: '', location: '', price: '', status: '', image: '' });
  const [previewImage, setPreviewImage] = useState('');
  const [formErrors, setFormErrors] = useState({});

  const openModal = (type, property = null) => {
    setModalType(type);
    setCurrentProperty(property);
    if (type === 'edit' && property) {
      setFormData({ ...property });
      setPreviewImage(property.image);
    } else if (type === 'add') {
      setFormData({ title: '', location: '', price: '', status: '', image: '' });
      setPreviewImage('');
    }
    setFormErrors({});
  };

  const closeModal = () => {
    setModalType(null);
    setFormData({ title: '', location: '', price: '', status: '', image: '' });
    setPreviewImage('');
    setCurrentProperty(null);
    setFormErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, image: imageUrl }));
      setPreviewImage(imageUrl);
      setFormErrors((prev) => ({ ...prev, image: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = 'Title is required';
    if (!formData.location.trim()) errors.location = 'Location is required';
    if (!formData.price.trim()) errors.price = 'Price is required';
    if (!formData.status.trim()) errors.status = 'Status is required';
    if (!formData.image.trim()) errors.image = 'Image is required';
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    if (modalType === 'add') {
      const newId = properties.length ? Math.max(...properties.map((p) => p.id)) + 1 : 1;
      setProperties([...properties, { ...formData, id: newId }]);
    } else if (modalType === 'edit') {
      setProperties(properties.map((p) => (p.id === currentProperty.id ? { ...formData, id: currentProperty.id } : p)));
    }
    closeModal();
  };

  const handleDelete = () => {
    setProperties(properties.filter((p) => p.id !== currentProperty.id));
    closeModal();
  };

  return (
    <div className="dashboard-container p-3">
      <h2 className="properties-title">My Properties</h2>
      <button className="add-btn" onClick={() => openModal('add')}>Add Property</button>

      <div className="properties-grid">
        {properties.map((property) => (
          <div key={property.id} className="property-card">
            <img src={property.image} alt={property.title} className="property-image" />
            <h4 className="property-title">{property.title}</h4>
            <p><strong>Location:</strong> {property.location}</p>
            <p><strong>Price:</strong> {property.price}</p>
            <p><strong>Status:</strong>
              <span className={`status-badge ${property.status === 'Available' ? 'available' : 'sold'}`}>{property.status}</span>
            </p>
            <div className="card-buttons">
              <button className="edit-btn" onClick={() => openModal('edit', property)}>Edit</button>
              <button className="delete-btn" onClick={() => openModal('delete', property)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {(modalType === 'add' || modalType === 'edit') && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{modalType === 'add' ? 'Add Property' : 'Edit Property'}</h3>
            <form onSubmit={handleSubmit}>

              {['title', 'location', 'price'].map((field) => (
                <div key={field}>
                  <input
                    type="text"
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                    className={formErrors[field] ? 'error-input' : ''}
                  />
                  {formErrors[field] && <p className="error-text">{formErrors[field]}</p>}
                </div>
              ))}

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={formErrors.status ? 'error-input' : ''}
              >
                <option value="">Select Status</option>
                <option value="Available">Available</option>
                <option value="Sold">Sold</option>
              </select>
              {formErrors.status && <p className="error-text">{formErrors.status}</p>}

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className={formErrors.image ? 'error-input' : ''}
              />
              {formErrors.image && <p className="error-text">{formErrors.image}</p>}
              {previewImage && <img src={previewImage} alt="Preview" className="preview-image" />}

              <div className="modal-buttons">
                <button type="submit">{modalType === 'add' ? 'Add' : 'Save'}</button>
                <button type="button" className="cancel-btn" onClick={closeModal}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {modalType === 'delete' && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Are you sure you want to delete <strong>{currentProperty?.title}</strong>?</h3>
            <div className="modal-buttons">
              <button onClick={handleDelete}>Yes, Delete</button>
              <button className="cancel-btn" onClick={closeModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProperties;
