import React from "react";
import { Link } from "react-router-dom";
import { FaUserCircle, FaSignInAlt, FaUserPlus, FaUser, FaSignOutAlt, FaHeart } from "react-icons/fa"; 

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg custom-navbar">
      <div className="container">
        <Link className="navbar-brand text-white fw-bold" to="/">Property</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link text-white" to="/">Home</Link>
            </li>

            {/* Properties Dropdown */}
            <li className="nav-item dropdown">
              <Link className="nav-link dropdown-toggle text-white" to="#" id="propertyDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Properties
              </Link>
              <ul className="dropdown-menu">
                <li><Link className="dropdown-item custom-dropdown-item" to="/AllProperties">All Properties</Link></li>
                <li><Link className="dropdown-item custom-dropdown-item" to="/property/featured">Featured</Link></li>
              </ul>
            </li>

            <li className="nav-item">
              <Link className="nav-link text-white" to="/services">Services</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/allagents">Agents</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/about">About</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/Contact">Contact Us</Link>
            </li>

            {/* Wishlist Icon */}
            <li className="nav-item">
              <Link className="nav-link text-white" to="/wishlist">
                <FaHeart size={20} />
              </Link>
            </li>

            {/* User Dropdown */}
            <li className="nav-item dropdown">
              <Link className="nav-link dropdown-toggle text-white d-flex align-items-center" to="#" id="userDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                <FaUserCircle size={20} className="me-1" />
              </Link>
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <Link className="dropdown-item custom-dropdown-item" to="/login">
                    <FaSignInAlt className="me-2" /> Login
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item custom-dropdown-item" to="/signup">
                    <FaUserPlus className="me-2" /> Signup
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item custom-dropdown-item" to="/profile">
                    <FaUser className="me-2" /> Profile
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item custom-dropdown-item text-danger" to="/logout">
                    <FaSignOutAlt className="me-2" /> Logout
                  </Link>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
