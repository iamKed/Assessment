const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/rfps', require('./routes/rfps'));
app.use('/api/vendors', require('./routes/vendors'));
app.use('/api/proposals', require('./routes/proposals'));
app.use('/api/email', require('./routes/email'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'RFP Management API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Start email polling service
require('./services/emailPolling').start();
