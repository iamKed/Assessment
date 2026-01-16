import React, { useState, useEffect } from 'react';
import client from '../api/client';
import './Vendors.css';

function Vendors() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contactPerson: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const response = await client.get('/vendors');
      setVendors(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load vendors');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await client.post('/vendors', formData);
      setShowForm(false);
      setFormData({
        name: '',
        email: '',
        contactPerson: '',
        phone: '',
        address: '',
      });
      fetchVendors();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create vendor');
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this vendor?')) {
      return;
    }

    try {
      await client.delete(`/vendors/${id}`);
      fetchVendors();
    } catch (err) {
      setError('Failed to delete vendor');
      console.error(err);
    }
  };

  if (loading) {
    return <div className="loading">Loading vendors...</div>;
  }

  return (
    <div className="container">
      <div className="page-header">
        <h2>Vendors</h2>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          {showForm ? 'Cancel' : 'Add Vendor'}
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      {showForm && (
        <div className="card">
          <h3>Add New Vendor</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name *</label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="contactPerson">Contact Person</label>
              <input
                id="contactPerson"
                type="text"
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <input
                id="phone"
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label htmlFor="address">Address</label>
              <textarea
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                rows="3"
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Create Vendor
            </button>
          </form>
        </div>
      )}

      {vendors.length === 0 ? (
        <div className="card">
          <p>No vendors yet. Add your first vendor to get started!</p>
        </div>
      ) : (
        <div className="card">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Contact Person</th>
                <th>Phone</th>
                <th>Proposals</th>
                <th>RFPs</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map((vendor) => (
                <tr key={vendor.id}>
                  <td>{vendor.name}</td>
                  <td>{vendor.email}</td>
                  <td>{vendor.contactPerson || 'N/A'}</td>
                  <td>{vendor.phone || 'N/A'}</td>
                  <td>
                    <span className="badge badge-info">
                      {vendor.proposalCount || 0} proposal{vendor.proposalCount !== 1 ? 's' : ''}
                    </span>
                  </td>
                  <td>
                    <span className="badge badge-secondary">
                      {vendor.rfpCount || 0} RFP{vendor.rfpCount !== 1 ? 's' : ''}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => handleDelete(vendor.id)}
                      className="btn btn-danger"
                      style={{ padding: '5px 10px', fontSize: '14px' }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Vendors;
