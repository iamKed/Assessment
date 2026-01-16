import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import client from '../api/client';
import './CompareProposals.css';

function CompareProposals() {
  const { id } = useParams();
  const [comparison, setComparison] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchComparison();
  }, [id]);

  const fetchComparison = async () => {
    try {
      setLoading(true);
      const response = await client.get(`/rfps/${id}/compare`);
      setComparison(response.data.comparison);
      setProposals(response.data.proposals);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load comparison');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Generating comparison...</div>;
  }

  if (error) {
    return (
      <div className="container">
        <div className="error">{error}</div>
        <Link to={`/rfp/${id}`} className="btn btn-primary">
          Back to RFP
        </Link>
      </div>
    );
  }

  if (!comparison || proposals.length === 0) {
    return (
      <div className="container">
        <div className="error">No proposals to compare</div>
        <Link to={`/rfp/${id}`} className="btn btn-primary">
          Back to RFP
        </Link>
      </div>
    );
  }

  const recommendedVendor = comparison.recommendation?.split(' ')[0] || '';

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <Link to={`/rfp/${id}`} className="back-link">← Back to RFP</Link>
          <h2>Compare Proposals</h2>
        </div>
      </div>

      {comparison.summary && (
        <div className="card">
          <h3>Comparison Summary</h3>
          <p>{comparison.summary}</p>
        </div>
      )}

      {comparison.recommendation && (
        <div className="card recommendation-card">
          <h3>AI Recommendation</h3>
          <p>{comparison.recommendation}</p>
        </div>
      )}

      <div className="comparison-grid">
        {proposals.map((proposal) => {
          const isRecommended = proposal.vendor.name === recommendedVendor;
          return (
            <div
              key={proposal.id}
              className={`proposal-card ${isRecommended ? 'recommended' : ''}`}
            >
              {isRecommended && (
                <div className="recommended-badge">Recommended</div>
              )}
              <h3>{proposal.vendor.name}</h3>
              {proposal.aiScore && (
                <div className="score">Score: {proposal.aiScore}/100</div>
              )}

              {proposal.pricing && (
                <div className="proposal-section">
                  <h4>Pricing</h4>
                  {proposal.pricing.totalPrice && (
                    <div className="proposal-detail">
                      <strong>Total:</strong> ${parseFloat(proposal.pricing.totalPrice).toLocaleString()}
                    </div>
                  )}
                  {typeof proposal.pricing === 'object' && Object.keys(proposal.pricing).length > 0 && (
                    <div>
                      {Object.entries(proposal.pricing).map(([key, value]) => {
                        if (key === 'totalPrice') return null;
                        if (typeof value === 'object') {
                          return (
                            <div key={key} className="proposal-detail">
                              <strong>{key}:</strong> {JSON.stringify(value)}
                            </div>
                          );
                        }
                        return (
                          <div key={key} className="proposal-detail">
                            <strong>{key}:</strong> {value}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {proposal.terms && (
                <div className="proposal-section">
                  <h4>Terms</h4>
                  {proposal.terms.deliveryTime && (
                    <div className="proposal-detail">
                      <strong>Delivery:</strong> {proposal.terms.deliveryTime}
                    </div>
                  )}
                  {proposal.terms.paymentTerms && (
                    <div className="proposal-detail">
                      <strong>Payment:</strong> {proposal.terms.paymentTerms}
                    </div>
                  )}
                  {proposal.terms.warranty && (
                    <div className="proposal-detail">
                      <strong>Warranty:</strong> {proposal.terms.warranty}
                    </div>
                  )}
                </div>
              )}

              {proposal.strengths && proposal.strengths.length > 0 && (
                <div className="strengths">
                  <h4>Strengths</h4>
                  <ul>
                    {proposal.strengths.map((strength, idx) => (
                      <li key={idx}>{strength}</li>
                    ))}
                  </ul>
                </div>
              )}

              {proposal.weaknesses && proposal.weaknesses.length > 0 && (
                <div className="weaknesses">
                  <h4>Weaknesses</h4>
                  <ul>
                    {proposal.weaknesses.map((weakness, idx) => (
                      <li key={idx}>{weakness}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CompareProposals;
