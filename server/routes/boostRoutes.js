const express = require('express');
const router = express.Router();

// Import controller (we'll create this next)
const { boostViews } = require('../controllers/boostController');

// POST route for boosting views
router.post('/', boostViews);

// GET route for health check
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

module.exports = router; 