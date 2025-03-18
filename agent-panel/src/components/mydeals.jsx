import React, { useState } from 'react';
import '../styles/MyDeals.css';

const initialDeals = [
  { id: 1, title: 'Luxury Apartment', buyer: 'John Doe', amount: '₹1.2 Cr', status: 'Active' },
  { id: 2, title: 'Modern Villa', buyer: 'Jane Smith', amount: '₹2.5 Cr', status: 'Closed' },
  { id: 3, title: 'Cozy Cottage', buyer: 'Alice Johnson', amount: '₹80 Lakh', status: 'Active' },
];

const MyDeals = () => {
  const [deals, setDeals] = useState(initialDeals);
  const [modalType, setModalType] = useState(null);
  const [currentDeal, setCurrentDeal] = useState(null);

  // Summary counts
  const totalDeals = deals.length;
  const totalClosedDeals = deals.filter((deal) => deal.status === 'Closed').length;
  const totalActiveDeals = deals.filter((deal) => deal.status === 'Active').length;

  const openModal = (type, deal = null) => {
    setModalType(type);
    setCurrentDeal(deal);
  };

  const closeModal = () => {
    setModalType(null);
    setCurrentDeal(null);
  };

  const handleDelete = () => {
    setDeals(deals.filter((d) => d.id !== currentDeal.id));
    closeModal();
  };

  const toggleStatus = (deal) => {
    const updatedDeals = deals.map((d) =>
      d.id === deal.id
        ? { ...d, status: d.status === 'Active' ? 'Closed' : 'Active' }
        : d
    );
    setDeals(updatedDeals);
  };

  return (
    <div className="dashboard-container p-3">
      <h2 className="deals-title">My Deals</h2>

      {/* Summary Section */}
      <div className="deal-summary">
        <div>Total Deals: <strong>{totalDeals}</strong></div>
        <div>Active Deals: <strong>{totalActiveDeals}</strong></div>
        <div>Closed Deals: <strong>{totalClosedDeals}</strong></div>
      </div>

      <div className="deals-grid">
        {deals.map((deal) => (
          <div key={deal.id} className="deal-card">
            <h4 className="deal-title">{deal.title}</h4>
            <p><strong>Buyer:</strong> {deal.buyer}</p>
            <p><strong>Amount:</strong> {deal.amount}</p>
            <p><strong>Status:</strong>
              <span className={`status-badge ${deal.status === 'Active' ? 'active' : 'closed'}`}>{deal.status}</span>
            </p>
            <div className="card-buttons">
              <button
                className={`status-toggle-btn ${deal.status === 'Active' ? 'inactive-btn' : 'active-btn'}`}
                onClick={() => toggleStatus(deal)}
              >
                {deal.status === 'Active' ? 'Mark Inactive' : 'Mark Active'}
              </button>
              <button className="delete-btn" onClick={() => openModal('delete', deal)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {modalType === 'delete' && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Are you sure you want to delete the deal for <strong>{currentDeal?.title}</strong>?</h3>
            <div className="modal-buttons">
              <button onClick={handleDelete}>Yes, Delete</button>
              <button className="cancel-btn" onClick={closeModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyDeals;
