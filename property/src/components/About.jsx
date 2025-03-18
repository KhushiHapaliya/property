import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import house1 from "./images/house1.jpg";
import house2 from "./images/img1.jpg";

const About = () => {
  return (
    <div>
      {/* Hero Section */}
      <div className="hero-section" style={{ backgroundImage: `url(${house2})`, backgroundSize: "cover", backgroundPosition: "center" }}>
        <div className="hero-overlay text-white text-center py-5" style={{ background: "rgba(0,0,0,0.5)" }}>
          {/* <h1>5232 California Ave. 21BC</h1> */}
          <p>Home / About</p>
        </div>
      </div>

      <div className="container my-5">
        {/* About Section */}
        <div className="row align-items-center">
          {/* Text Content */}
          <div className="col-lg-6">
            <h2 className="fw-bold navbar-color">About Us</h2>
            <p>Lorem ipsum dolor sit amet consectetur adipiscing elit. Numquam enim pariatur similique debitis vel nisi qui reprehenderit totam? Quod maiores.</p>
            <p>Lorem ipsum dolor sit amet consectetur adipiscing elit. Magni saepe, explicabo nihil. Est, autem error cumque ipsum repellendus veniam sed blanditiis unde ullam maxime veritatis.</p>
            <p>Enim, nisi labore exercitationem facere cupiditate nobis quod autem veritatis quis minima expedita. Cumque odio illo justo reiciendis, labore impedit omnis.</p>
            <p>Enim, nisi labore exercitationem facere cupiditate nobis quod autem veritatis quis minima expedita. Cumque odio illo justo reiciendis, labore impedit omnis.</p>
            <p>Lorem ipsum dolor sit amet consectetur adipiscing elit. Magni saepe, explicabo nihil. Est, autem error cumque ipsum repellendus veniam sed blanditiis unde ullam maxime veritatis.</p>
          </div>

          {/* Image Section */}
          <div className="col-lg-6 text-end">
            <img src={house1} alt="Modern House" className="img-fluid rounded shadow" />
          </div>
        </div>

        {/* Features Section */}
        <div className="row text-center mt-5">
          <div className="col-md-4">
            <div>
              <img src="https://cdn-icons-png.flaticon.com/128/8090/8090124.png" alt="Home" width="50px" />
              <h5 className="fw-bold mt-2">Quality properties</h5>
              <p>Lorem ipsum dolor sit amet consectetur adipiscing elit.</p>
            </div>
          </div>

          <div className="col-md-4">
            <div>
              <img src="https://cdn-icons-png.flaticon.com/128/848/848043.png" alt="Agent" width="50px" />
              <h5 className="fw-bold mt-2">Top rated agents</h5>
              <p>Lorem ipsum dolor sit amet consectetur adipiscing elit.</p>
            </div>
          </div>

          <div className="col-md-4">
            <div>
              <img src="https://cdn-icons-png.flaticon.com/128/929/929422.png" alt="Shield" width="50px" />
              <h5 className="fw-bold mt-2">Easy and safe</h5>
              <p>Lorem ipsum dolor sit amet consectetur adipiscing elit.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
