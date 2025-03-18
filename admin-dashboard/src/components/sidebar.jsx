import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 992) {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close sidebar when route changes (mobile only)
  useEffect(() => {
    if (window.innerWidth < 992) {
      setIsOpen(false);
    }
  }, [location]);

  return (
    <>
      {/* Toggle Button (Hamburger Icon) */}
      <button className="toggle-sidebar d-lg-none" onClick={toggleSidebar}>
        <i className="fas fa-bars"></i>
      </button>

      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? "show" : ""}`}>
        <div className="logo d-flex align-items-center px-3 py-3 border-bottom">
          <i className="fas fa-home fs-4 me-2"></i>
          <h4 className="mb-0">Property Admin</h4>
          <button 
            className="btn-close btn-close-white ms-auto d-lg-none" 
            onClick={toggleSidebar} 
            aria-label="Close"
          ></button>
        </div>

        <nav className="nav flex-column mt-3 px-3">
          <Link 
            to="/dashboard" 
            className={`nav-link mb-2 ${location.pathname === "/dashboard" ? "active" : ""}`}
          >
            <i className="fas fa-tachometer-alt me-2"></i> Dashboard
          </Link>
          <Link 
            to="/user" 
            className={`nav-link mb-2 ${location.pathname === "/user" ? "active" : ""}`}
          >
            <i className="fas fa-users me-2"></i> Users
          </Link>
          <Link 
            to="/agent" 
            className={`nav-link mb-2 ${location.pathname === "/agent" ? "active" : ""}`}
          >
            <i className="fas fa-user-tie me-2"></i> Agents
          </Link>
          <Link 
            to="/properties" 
            className={`nav-link mb-2 ${location.pathname === "/properties" ? "active" : ""}`}
          >
            <i className="fas fa-building me-2"></i> Properties
          </Link>
          <Link 
            to="/wishlist" 
            className={`nav-link mb-2 ${location.pathname === "/wishlist" ? "active" : ""}`}
          >
            <i className="fas fa-heart me-2"></i> Wishlist
          </Link>
          <Link 
            to="/appointment" 
            className={`nav-link mb-2 ${location.pathname === "/appointment" ? "active" : ""}`}
          >
            <i className="fas fa-calendar-check me-2"></i> Appointments
          </Link>
          <div className="border-top my-3"></div>
          <Link 
            to="/profile" 
            className={`nav-link mb-2 ${location.pathname === "/profile" ? "active" : ""}`}
          >
            <i className="fas fa-user-circle me-2"></i> My Profile
          </Link>
          <Link 
            to="/aboutus" 
            className={`nav-link mb-2 ${location.pathname === "/aboutus" ? "active" : ""}`}
          >
            <i className="fas fa-info-circle me-2"></i> About Us
          </Link>
          <Link 
            to="/contactus" 
            className={`nav-link mb-2 ${location.pathname === "/contactus" ? "active" : ""}`}
          >
            <i className="fas fa-envelope me-2"></i> Contact Us
          </Link>
        </nav>
      </div>

      {/* Overlay when sidebar is open on mobile */}
      {isOpen && <div className="sidebar-overlay d-lg-none" onClick={toggleSidebar}></div>}
    </>
  );
};

export default Sidebar;