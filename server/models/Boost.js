const mongoose = require('mongoose');

const boostSchema = new mongoose.Schema({
  videoUrl: {
    type: String,
    required: true
  },
  viewsAdded: {
    type: Number,
    default: 0
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Boost', boostSchema); 