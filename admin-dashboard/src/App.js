import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/sidebar';
import Dashboard from './components/dashboard';
import UserManagement from './components/user';
import Header from './components/header';
// import Footer from './components/footer';
import Agents from './components/agent';
import Properties from './components/properties';
import Wishlist from './components/wishlist';
import Appointment from './components/appointment';
import AboutUs from './components/aboutus';
import ContactUs from './components/contactus';
import Profile from './components/profile';

function App() {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <Header />
        <div className="d-flex flex-grow-1">
          <Sidebar />
          <main className="content-wrapper flex-grow-1 p-3 p-md-4">
            <Routes>
              {/* Redirect root path to dashboard */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/user" element={<UserManagement />} />
              <Route path="/agent" element={<Agents />} />
              <Route path="/properties" element={<Properties />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/appointment" element={<Appointment />} />
              <Route path="/aboutus" element={<AboutUs />} />
              <Route path="/contactus" element={<ContactUs />} />
              <Route path="/profile" element={<Profile />} />
              {/* Catch all route - redirect to dashboard if route doesn't exist */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
            {/* <Footer/> */}
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;