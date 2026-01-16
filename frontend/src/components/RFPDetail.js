import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import client from '../api/client';
import './RFPDetail.css';

function RFPDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [rfp, setRfp] = useState(null);
  const [vendors, setVendors] = useState([]);
  const [selectedVendors, setSelectedVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchRFP();
    fetchVendors();
  }, [id]);

  const fetchRFP = async () => {
    try {
      const response = await client.get(`/rfps/${id}`);
      setRfp(response.data);
    } catch (err) {
      setError('Failed to load RFP');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchVendors = async () => {
    try {
      const response = await client.get('/vendors');
      setVendors(response.data);
    } catch (err) {
      console.error('Failed to load vendors');
    }
  };

  const handleVendorToggle = (vendorId) => {
    setSelectedVendors((prev) =>
      prev.includes(vendorId)
        ? prev.filter((id) => id !== vendorId)
        : [...prev, vendorId]
    );
  };

  const handleSendRFP = async () => {
    if (selectedVendors.length === 0) {
      setError('Please select at least one vendor');
      return;
    }

    try {
      setSending(true);
      setError(null);
      const response = await client.post(`/rfps/${id}/send`, {
        vendorIds: selectedVendors,
      });
      setSuccess(`RFP sent to ${response.data.results.filter(r => r.success).length} vendor(s)`);
      fetchRFP(); // Refresh RFP data
      setSelectedVendors([]);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send RFP');
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading RFP...</div>;
  }

  if (!rfp) {
    return <div className="error">RFP not found</div>;
  }

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <Link to="/" className="back-link">← Back to Dashboard</Link>
          <h2>{rfp.title}</h2>
        </div>
        <div>
          <span className={`badge badge-${rfp.status}`}>{rfp.status}</span>
        </div>
      </div>

      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      <div className="card">
        <h3>RFP Details</h3>
        <p><strong>Description:</strong> {rfp.description}</p>
        {rfp.budget && (
          <p><strong>Budget:</strong> ${parseFloat(rfp.budget).toLocaleString()}</p>
        )}
        {rfp.deadline && (
          <p><strong>Deadline:</strong> {new Date(rfp.deadline).toLocaleDateString()}</p>
        )}
        {rfp.requirements && rfp.requirements.length > 0 && (
          <div>
            <strong>Requirements:</strong>
            <ul>
              {rfp.requirements.map((req, idx) => (
                <li key={idx}>
                  {req.item} - Quantity: {req.quantity || 'N/A'}
                  {req.specifications && (
                    <ul>
                      {Object.entries(req.specifications).map(([key, value]) => (
                        <li key={key}>{key}: {value}</li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
        {rfp.paymentTerms && (
          <p><strong>Payment Terms:</strong> {rfp.paymentTerms}</p>
        )}
        {rfp.warranty && (
          <p><strong>Warranty:</strong> {rfp.warranty}</p>
        )}
      </div>

      {rfp.proposals && rfp.proposals.length > 0 && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>Proposals ({rfp.proposals.length})</h3>
            <Link to={`/rfp/${id}/compare`} className="btn btn-secondary">
              Compare Proposals
            </Link>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>Vendor</th>
                <th>Status</th>
                <th>Score</th>
                <th>Received</th>
              </tr>
            </thead>
            <tbody>
              {rfp.proposals.map((proposal) => (
                <tr key={proposal.id}>
                  <td>{proposal.vendor?.name}</td>
                  <td>
                    <span className={`badge badge-${proposal.status}`}>
                      {proposal.status}
                    </span>
                  </td>
                  <td>
                    {proposal.aiScore ? `${proposal.aiScore}/100` : 'N/A'}
                  </td>
                  <td>{new Date(proposal.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {rfp.status === 'draft' && (
        <div className="card">
          <h3>Send RFP to Vendors</h3>
          {vendors.length === 0 ? (
            <p>
              No vendors available. <Link to="/vendors">Add vendors</Link> first.
            </p>
          ) : (
            <>
              <div className="vendor-selection">
                {vendors.map((vendor) => (
                  <label key={vendor.id} className="vendor-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedVendors.includes(vendor.id)}
                      onChange={() => handleVendorToggle(vendor.id)}
                    />
                    <span>
                      {vendor.name} ({vendor.email})
                    </span>
                  </label>
                ))}
              </div>
              <button
                onClick={handleSendRFP}
                className="btn btn-primary"
                disabled={sending || selectedVendors.length === 0}
                style={{ marginTop: '20px' }}
              >
                {sending ? 'Sending...' : `Send RFP to ${selectedVendors.length} Vendor(s)`}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default RFPDetail;
