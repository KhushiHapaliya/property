import React, { useState } from "react";
import house1 from "./images/house1.jpg";
import house2 from "./images/house2.jpg";
import house3 from "./images/house3.jpg";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([
    {
      id: 1,
      image: house1,
      name: "5232 California Fake, Ave. 21BC",
      price: "$1,291,000",
      location: "California, USA",
    },
    {
      id: 2,
      image: house2,
      name: "7315 Maple Drive, Apt. 7D",
      price: "$1,450,000",
      location: "New York, USA",
    },
    {
      id: 3,
      image: house3,
      name: "44 Ocean Avenue, Suite 5A",
      price: "$980,000",
      location: "Miami, USA",
    },
  ]);

  const removeFromWishlist = (id) => {
    setWishlist(wishlist.filter((property) => property.id !== id));
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">My Wishlist</h2>
      {wishlist.length > 0 ? (
        <div className="table-responsive">
          <table className="table table-hover text-center align-middle">
            
            <thead className="text-white" style={{ backgroundColor: "#003f3f !important" }}>
              <tr>
                <th>Image</th>
                <th>Property Name</th>
                <th>Price</th>
                <th>Location</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {wishlist.map((property) => (
                <tr key={property.id}>
                  <td>
                    <img
                      src={property.image}
                      alt={property.name}
                      className="rounded"
                      style={{ width: "80px", height: "60px", objectFit: "cover" }}
                    />
                  </td>
                  <td>{property.name}</td>
                  <td className="fw-bold">{property.price}</td>
                  <td>{property.location}</td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => removeFromWishlist(property.id)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-muted">Your wishlist is empty.</p>
      )}
    </div>
  );
};

export default Wishlist;
