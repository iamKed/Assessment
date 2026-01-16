import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';
import './CreateRFP.css';

function CreateRFP() {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [rfp, setRfp] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!description.trim()) {
      setError('Please enter a procurement description');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await client.post('/rfps/create-from-text', {
        description,
      });
      setRfp(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create RFP. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewRFP = () => {
    navigate(`/rfp/${rfp.id}`);
  };

  return (
    <div className="container">
      <div className="page-header">
        <h2>Create RFP from Natural Language</h2>
      </div>

      {error && <div className="error">{error}</div>}

      {!rfp ? (
        <div className="card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="description">
                Describe what you want to procure in natural language:
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Example: I need to procure laptops and monitors for our new office. Budget is $50,000 total. Need delivery within 30 days. We need 20 laptops with 16GB RAM and 15 monitors 27-inch. Payment terms should be net 30, and we need at least 1 year warranty."
                rows="10"
                disabled={loading}
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Creating RFP...' : 'Create RFP'}
            </button>
          </form>
        </div>
      ) : (
        <div className="card">
          <div className="success">
            RFP created successfully!
          </div>
          <h3>{rfp.title}</h3>
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
          <div style={{ marginTop: '20px' }}>
            <button onClick={handleViewRFP} className="btn btn-primary">
              View RFP Details
            </button>
            <button
              onClick={() => {
                setRfp(null);
                setDescription('');
              }}
              className="btn btn-secondary"
              style={{ marginLeft: '10px' }}
            >
              Create Another
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CreateRFP;
