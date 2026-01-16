const express = require('express');
const router = express.Router();

// Health check for email service
router.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Email service is running' });
});

module.exports = router;
