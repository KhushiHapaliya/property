import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Slider from "./components/Slider";
import PropertyList from "./components/PropertyList";
import PropertyDetails from "./components/PropertyDetails";
import Agents from "./components/Agents";
import About from "./components/About";
import Appointment from "./components/Appointment";
import Services from "./components/Services";
import AllProperties from "./components/AllProperties";
import AllAgents from "./components/AllAgents";  
import AgentDetails from "./components/AgentDetails";
import Contact from "./components/Contact";
import Wishlist from "./components/Wishlist";
import Footer from "./components/Footer";
import Login from "./components/Login";
import ForgotPass from "./components/ForgotPass";
import Signup from "./components/Signup";
import Profile from "./components/Profile";
import EditProfile from "./components/EditProfile";
import ChangePass from "./components/ChangePass";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Slider />
              <PropertyList />
              <Agents />
            </>
          }
        />
        <Route path="/property/:id" element={<PropertyDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPass />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/allproperties" element={<AllProperties />} />
        <Route path="/allagents" element={<AllAgents />} /> 
        <Route path="/appointment" element={<Appointment />} />
        <Route path="/agentdetails/:id" element={<AgentDetails />} /> 
        <Route path="/contact" element={<Contact />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/change-password" element={<ChangePass />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
