// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';
import Sidebar from './components/sidebar';
// import Navbar from './components/navbar';
import Dashboard from './components/dashboard';
import MyAppointments from './components/appointments';
import MyProperties from './components/myproperties';
import MyDeals from './components/mydeals';
import Profile from './components/profile';

function App() {
  return (
    <Router>
      <div className="app-wrapper d-flex">
        <div className="sidebar-container">
          <Sidebar />
        </div>
        <div className="main-content flex-grow-1">
          {/* <Navbar /> */}
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/myproperties" element={<MyProperties />} />
            <Route path="/appointments" element={<MyAppointments />} />
            <Route path="/mydeals" element={<MyDeals />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;