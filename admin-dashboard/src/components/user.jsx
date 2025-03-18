import React, { useState } from "react";
import { Plus } from "lucide-react";
import "./user.css";
import user1Img from './images/user1.jpg';
import user2Img from './images/user2.jpg';

const initialUsers = [
  {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    address: "123 Main Street",
    city: "New York",
    state: "NY",
    email: "john.doe@example.com",
    phone: "123-456-7890",
    dob: "1990-01-01",
    gender: "Male",
    role: "Admin",
    profile: user1Img,
    password: "password123",
  },
  {
    id: 2,
    firstName: "Jane",
    lastName: "Smith",
    address: "456 Maple Avenue",
    city: "Los Angeles",
    state: "CA",
    email: "jane.smith@example.com",
    phone: "987-654-3210",
    dob: "1985-05-15",
    gender: "Female",
    role: "User",
    profile: user2Img,
    password: "secret456",
  },
];

const emptyUserTemplate = {
  firstName: "",
  lastName: "",
  address: "",
  city: "",
  state: "",
  email: "",
  phone: "",
  dob: "",
  gender: "",
  role: "",
  profile: "",
  password: "",
};

const Users = () => {
  const [users, setUsers] = useState(initialUsers);
  const [currentUser, setCurrentUser] = useState(emptyUserTemplate);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState("");

  const validateFields = (user) => {
    const err = {};
    Object.keys(user).forEach((key) => {
      if (!user[key] && key !== "profile") err[key] = "This field is required";
    });
    return err;
  };

  const handleAddOrUpdateUser = () => {
    const validationErrors = validateFields(currentUser);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (isEditMode) {
      setUsers(users.map((u) => (u.id === currentUser.id ? currentUser : u)));
    } else {
      const newId = users.length ? Math.max(...users.map((u) => u.id)) + 1 : 1;
      setUsers([...users, { id: newId, ...currentUser }]);
    }

    handleCloseModal();
  };

  const handleDeleteUser = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setUsers(users.filter((u) => u.id !== id));
    }
  };

  const handleInputChange = (field, value) => {
    setCurrentUser((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentUser((prev) => ({ ...prev, profile: reader.result }));
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOpenModal = (user = null) => {
    if (user) {
      setIsEditMode(true);
      setCurrentUser(user);
      setImagePreview(user.profile);
    } else {
      setIsEditMode(false);
      setCurrentUser(emptyUserTemplate);
      setImagePreview("");
    }
    setErrors({});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentUser(emptyUserTemplate);
    setImagePreview("");
    setErrors({});
  };

  const renderInput = (label, field, type = "text", options = []) => (
    <div className="form-group mb-2">
      <label>{label}</label>
      {options.length ? (
        <select
          value={currentUser[field]}
          className={`form-control ${errors[field] ? "is-invalid" : ""}`}
          onChange={(e) => handleInputChange(field, e.target.value)}
        >
          <option value="">Select {label}</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          value={currentUser[field]}
          className={`form-control ${errors[field] ? "is-invalid" : ""}`}
          onChange={(e) => handleInputChange(field, e.target.value)}
        />
      )}
      {errors[field] && <div className="invalid-feedback">{errors[field]}</div>}
    </div>
  );

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>User Management</h2>
        <button className="btn btn-success" onClick={() => handleOpenModal()}>
          <Plus size={18} /> Add User
        </button>
      </div>

      <div className="card">
        <div className="card-body p-0 overflow-auto">
          <div className="table-container">
            <table className="table custom-table">
              <thead>
                <tr>
                  <th width="5%">ID</th>
                  <th width="10%">Profile</th>
                  <th width="20%">Name</th>
                  <th width="25%">Email</th>
                  <th width="15%">Role</th>
                  <th width="25%">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td><img src={user.profile} alt="Profile" className="user-avatar" /></td>
                    <td>{user.firstName} {user.lastName}</td>
                    <td>{user.email}</td>
                    <td><span className={`badge bg-${user.role === 'Admin' ? 'danger' : 'primary'}`}>{user.role}</span></td>
                    <td>
                      <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleOpenModal(user)}>Edit</button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteUser(user.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5>{isEditMode ? "Edit User" : "Add User"}</h5>
                <button className="btn-close" onClick={handleCloseModal}></button>
              </div>
              <div className="modal-body row">
                <div className="col-md-6">
                  {renderInput("First Name", "firstName")}
                  {renderInput("Last Name", "lastName")}
                  {renderInput("Email", "email", "email")}
                  {renderInput("Phone", "phone")}
                  {renderInput("Role", "role", "select", ["Admin", "User", "Agent"])}
                </div>
                <div className="col-md-6">
                  {renderInput("Password", "password", "password")}
                  <input type="file" className="form-control" onChange={handleImageUpload} />
                  {imagePreview && <img src={imagePreview} className="img-preview mt-2" alt="Preview" />}
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={handleCloseModal}>Cancel</button>
                <button className="btn btn-primary" onClick={handleAddOrUpdateUser}>{isEditMode ? "Update" : "Add"}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;