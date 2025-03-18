import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Style.css";
import house2 from "./images/img1.jpg";

const Services = () => {
  return (
    <div>
      {/* Hero Section */}
      <div
        className="hero-section"
        style={{
          backgroundImage: `url(${house2})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div
          className="hero-overlay text-white text-center py-5"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <p>Home / Services</p>
        </div>
      </div>

      {/* Services Section */}
      <div className="container my-5">
        <h2 className="text-center fw-bold navbar-color mb-4">Our Services</h2>

        {/* First Row of Services */}
        <div className="row text-center">
          {/* Service 1 */}
          <div className="col-md-3">
            <div className="service-card p-4 shadow-sm rounded">
              <div className="icon-circle">
                <img
                  src="https://cdn-icons-png.flaticon.com/128/8090/8090124.png"
                  alt="Home"
                  className="service-icon"
                />
              </div>
              <h5 className="fw-bold mt-3">Quality Properties</h5>
              <p>Find high-quality properties with modern designs.</p>
              <a href="#" className="read-more">Read more</a>
            </div>
          </div>

          {/* Service 2 */}
          <div className="col-md-3">
            <div className="service-card p-4 shadow-sm rounded">
              <div className="icon-circle">
                <img
                  src="https://cdn-icons-png.flaticon.com/128/848/848043.png"
                  alt="Agent"
                  className="service-icon"
                />
              </div>
              <h5 className="fw-bold mt-3">Top Rated Agents</h5>
              <p>Connect with the best real estate agents.</p>
              <a href="#" className="read-more">Read more</a>
            </div>
          </div>

          {/* Service 3 */}
          <div className="col-md-3">
            <div className="service-card p-4 shadow-sm rounded">
              <div className="icon-circle">
                <img
                  src="https://cdn-icons-png.flaticon.com/128/929/929422.png"
                  alt="Property"
                  className="service-icon"
                />
              </div>
              <h5 className="fw-bold mt-3">Property for Sale</h5>
              <p>Explore properties available for purchase.</p>
              <a href="#" className="read-more">Read more</a>
            </div>
          </div>

          {/* Service 4 */}
          <div className="col-md-3">
            <div className="service-card p-4 shadow-sm rounded">
              <div className="icon-circle">
                <img
                  src="https://cdn-icons-png.flaticon.com/128/929/929422.png"
                  alt="House"
                  className="service-icon"
                />
              </div>
              <h5 className="fw-bold mt-3">House for Sale</h5>
              <p>Find the perfect home for your family.</p>
              <a href="#" className="read-more">Read more</a>
            </div>
          </div>
        </div>

        {/* Second Row of Services */}
        <div className="row text-center mt-4">
          {/* Service 5 */}
          <div className="col-md-3">
            <div className="service-card p-4 shadow-sm rounded">
              <div className="icon-circle">
                <img
                  src="https://cdn-icons-png.flaticon.com/128/3514/3514691.png"
                  alt="Commercial"
                  className="service-icon"
                />
              </div>
              <h5 className="fw-bold mt-3">Commercial Spaces</h5>
              <p>Find the best commercial properties for business.</p>
              <a href="#" className="read-more">Read more</a>
            </div>
          </div>

          {/* Service 6 */}
          <div className="col-md-3">
            <div className="service-card p-4 shadow-sm rounded">
              <div className="icon-circle">
                <img
                  src="https://cdn-icons-png.flaticon.com/128/3135/3135768.png"
                  alt="Consulting"
                  className="service-icon"
                />
              </div>
              <h5 className="fw-bold mt-3">Real Estate Consulting</h5>
              <p>Get expert advice on property investments.</p>
              <a href="#" className="read-more">Read more</a>
            </div>
          </div>

          {/* Service 7 */}
          <div className="col-md-3">
            <div className="service-card p-4 shadow-sm rounded">
              <div className="icon-circle">
                <img
                  src="https://cdn-icons-png.flaticon.com/128/5659/5659065.png"
                  alt="Legal"
                  className="service-icon"
                />
              </div>
              <h5 className="fw-bold mt-3">Legal Assistance</h5>
              <p>Ensure legal security in property transactions.</p>
              <a href="#" className="read-more">Read more</a>
            </div>
          </div>

          {/* Service 8 */}
          <div className="col-md-3">
            <div className="service-card p-4 shadow-sm rounded">
              <div className="icon-circle">
                <img
                  src="https://cdn-icons-png.flaticon.com/128/1256/1256650.png"
                  alt="Loans"
                  className="service-icon"
                />
              </div>
              <h5 className="fw-bold mt-3">Home Loans</h5>
              <p>Find the best loan options for buying property.</p>
              <a href="#" className="read-more">Read more</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
