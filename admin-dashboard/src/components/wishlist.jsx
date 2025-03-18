import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./wishlist.css";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([
    {
      id: 1,
      userId: 101,
      propertyType: "Apartment",
      status: "For Sale",
      bedrooms: 3,
      bathrooms: 2,
      size: "1500 sqft",
      agent: "David Johnson",
      address: "123 Main St, New York, NY",
      description: "Beautiful apartment in the heart of the city.",
      picture: require("./images/property1.jpg"),
    },
    {
      id: 2,
      userId: 102,
      propertyType: "Villa",
      status: "For Rent",
      bedrooms: 4,
      bathrooms: 3,
      size: "2500 sqft",
      agent: "Sarah Parker",
      address: "456 Maple Ave, Los Angeles, CA",
      description: "Luxury villa with pool and garden.",
      picture: require("./images/property2.jpg"),
    },
  ]);

  // ✅ Delete handler
  const handleDelete = (id) => setWishlist(wishlist.filter((item) => item.id !== id));

  return (
    <div className="container mt-5">
      <h1>User's Wishlist</h1>

      {/* ✅ Wishlist Table */}
      <div className="table-container">
        <table className="table custom-table">
          <thead className="table-dark">
            <tr>
              <th>Id</th>
              <th>User ID</th>
              <th>Picture</th>
              <th>Property Type</th>
              <th>Status</th>
              <th>Bedrooms</th>
              <th>Bathrooms</th>
              <th>Size</th>
              <th>Agent</th>
              <th>Address</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {wishlist.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.userId}</td>
                <td>
                  <img
                    src={item.picture}
                    alt="Property"
                    style={{
                      height: "60px",
                      width: "60px",
                      objectFit: "cover",
                      borderRadius: "10%",
                    }}
                  />
                </td>
                <td>{item.propertyType}</td>
                <td>{item.status}</td>
                <td>{item.bedrooms}</td>
                <td>{item.bathrooms}</td>
                <td>{item.size}</td>
                <td>{item.agent}</td>
                <td>{item.address}</td>
                <td>{item.description}</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(item.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {wishlist.length === 0 && (
              <tr>
                <td colSpan="12" className="text-center text-muted">
                  No items in wishlist.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Wishlist;
