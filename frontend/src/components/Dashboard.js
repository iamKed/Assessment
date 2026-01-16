import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client';
import './Dashboard.css';

function Dashboard() {
  const [rfps, setRfps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRFPs();
  }, []);

  const fetchRFPs = async () => {
    try {
      setLoading(true);
      const response = await client.get('/rfps');
      setRfps(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load RFPs. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading RFPs...</div>;
  }

  return (
    <div className="container">
      <div className="page-header">
        <h2>RFPs</h2>
        <Link to="/create-rfp" className="btn btn-primary">
          Create New RFP
        </Link>
      </div>

      {error && <div className="error">{error}</div>}

      {rfps.length === 0 ? (
        <div className="card">
          <p>No RFPs yet. Create your first RFP to get started!</p>
        </div>
      ) : (
        <div className="grid">
          {rfps.map((rfp) => (
            <Link key={rfp.id} to={`/rfp/${rfp.id}`} className="rfp-card-link">
              <div className="rfp-card">
                <h3>{rfp.title}</h3>
                <p>{rfp.description.substring(0, 150)}...</p>
                <div className="rfp-meta">
                  <span className={`badge badge-${rfp.status}`}>
                    {rfp.status}
                  </span>
                  <span className="proposal-count">
                    {rfp.proposals?.length || 0} proposal(s)
                  </span>
                </div>
                {rfp.budget && (
                  <div className="rfp-budget">
                    Budget: ${parseFloat(rfp.budget).toLocaleString()}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
