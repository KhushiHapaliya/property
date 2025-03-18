import React from "react";
import { useNavigate } from "react-router-dom";
import house1 from "./images/house1.jpg";
import house2 from "./images/house2.jpg";
import house3 from "./images/house3.jpg";
import "./Style.css";

const properties = [
  {
    id: 1,
    img: house1,
    price: "$1,291,000",
    address: "5232 California Fake, Ave. 21BC",
    location: "California, USA",
    beds: 2,
    baths: 2,
  },
  {
    id: 2,
    img: house2,
    price: "$1,450,000",
    address: "7315 Maple Drive, Apt. 7D",
    location: "New York, USA",
    beds: 3,
    baths: 2,
  },
  {
    id: 3,
    img: house3,
    price: "$980,000",
    address: "44 Ocean Avenue, Suite 5A",
    location: "Miami, USA",
    beds: 4,
    baths: 3,
  },
  {
    id: 4,
    img: house1,
    price: "$1,600,000",
    address: "112 Sunset Blvd, Villa 3",
    location: "Los Angeles, USA",
    beds: 5,
    baths: 4,
  },
  {
    id: 5,
    img: house2,
    price: "$875,000",
    address: "285 Palm Street, Apt. 2B",
    location: "San Diego, USA",
    beds: 2,
    baths: 2,
  },
  {
    id: 6,
    img: house3,
    price: "$1,100,000",
    address: "99 Emerald Lane, House 12",
    location: "Texas, USA",
    beds: 3,
    baths: 3,
  },
];

const PropertyList = () => {
  const navigate = useNavigate();

  return (
    <div className="property-section">
      <h1>Popular Properties</h1>
      <div className="scroll-container">
        <div className="property-list">
          {properties.map((property) => (
            <div key={property.id} className="property-card">
              <img src={property.img} alt={property.location} />
              <div className="property-info">
                <h3>{property.price}</h3>
                <p>{property.address}</p>
                <strong>{property.location}</strong>
                <div className="property-details">
                  <span>🛏 {property.beds} beds</span>
                  <span>🛁 {property.baths} baths</span>
                </div>
                <button
                  className="details-btn"
                  onClick={() => navigate(`/property/${property.id}`)}
                >
                  See details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PropertyList;
