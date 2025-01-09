const express = require('express');
const router = express.Router();

// Import controller (we'll create this next)
const { boostViews } = require('../controllers/boostController');

// POST route for boosting views
router.post('/', boostViews);

module.exports = router; 