import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../styles/Sidebar.css';

const Sidebar = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setShowSidebar(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => setShowSidebar(!showSidebar);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="btn btn-primary d-md-none position-fixed start-0 top-0 m-2"
        onClick={toggleSidebar}
        style={{ zIndex: 1060, backgroundColor: '#003f3f', border: 'none' }}
      >
        <i className="bi bi-list"></i> 
      </button>

      {/* Desktop Sidebar */}
      <div className="sidebar d-none d-md-block">
        <h3 className="text-center my-4">Agent Panel</h3>
        <ul className="nav flex-column">
          {navLinks.map((link, index) => (
            <li key={index} className="nav-item">
              <NavLink
                to={link.path}
                end={link.exact}
                className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}
              >
                <i className={`${link.icon} me-2`}></i> {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      {/* Mobile Sidebar - Backdrop */}
      {isMobile && showSidebar && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
          style={{ zIndex: 1050 }}
          onClick={toggleSidebar}
        />
      )}

      {/* Mobile Sidebar - Menu */}
      <div
        className={`offcanvas offcanvas-start ${showSidebar ? 'show' : ''}`}
        tabIndex="-1"
        style={{
          width: '250px',
          backgroundColor: '#003f3f',
          color: 'white',
          zIndex: 1055,
          visibility: showSidebar ? 'visible' : 'hidden'
        }}
      >
        <div className="offcanvas-header">
          {/* <h5 className="offcanvas-title">         Agent Panel</h5> */}
          <button
            type="button"
            className="btn-close btn-close-white"
            onClick={toggleSidebar}
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body">
          <ul className="nav flex-column">
            {navLinks.map((link, index) => (
              <li key={index} className="nav-item">
                <NavLink
                  to={link.path}
                  end={link.exact}
                  className={({isActive}) => `nav-link ${isActive ? 'active' : ''} text-white`}
                  onClick={toggleSidebar}
                >
                  <i className={`${link.icon} me-2`}></i> {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

// Navigation links with corrected icons
const navLinks = [
  { path: '/', label: 'Dashboard', icon: 'bi bi-house', exact: true },
  { path: '/appointments', label: 'My Appointments', icon: 'bi bi-calendar-check', exact: false },
  { path: '/myproperties', label: 'My Properties', icon: 'bi bi-building', exact: false },
  { path: '/mydeals', label: 'My Deals', icon: 'bi bi-cash-stack', exact: false },
  { path: '/profile', label: 'Profile', icon: 'bi bi-person-circle', exact: false },
  { path: '/logout', label: 'Logout', icon: 'bi bi-box-arrow-right', exact: false },
];

export default Sidebar;