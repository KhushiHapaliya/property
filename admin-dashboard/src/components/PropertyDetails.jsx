import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const PropertyDetails = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/properties/${id}`);
        setProperty(response.data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch property details. Please try again later.");
        console.error("Error fetching property:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading property details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">{error}</div>
        <Link to="/properties" className="btn btn-primary">
          Back to Properties
        </Link>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning">Property not found</div>
        <Link to="/properties" className="btn btn-primary">
          Back to Properties
        </Link>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="card shadow-sm">
        <div className="row g-0">
          <div className="col-md-5">
            <img
              src={
                property.picture?.startsWith("http")
                  ? property.picture
                  : `${process.env.PUBLIC_URL}${property.picture}`
              }
              alt={property.title}
              className="img-fluid rounded-start"
              style={{ height: "100%", objectFit: "cover" }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `${process.env.PUBLIC_URL}/images/property-placeholder.jpg`;
              }}
            />
          </div>
          <div className="col-md-7">
            <div className="card-body">
              <h3 className="card-title">{property.title}</h3>
              <p className="card-text">
                <strong>Location:</strong> {property.location}
              </p>
              <p className="card-text">
                <strong>Price:</strong> ${property.price}
              </p>
              <p className="card-text">
                <strong>Description:</strong> {property.description}
              </p>
              <Link to="/properties" className="btn btn-secondary mt-3">
                Back to Properties
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
