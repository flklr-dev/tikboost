const mongoose = require('mongoose');

const boostSchema = new mongoose.Schema({
  videoUrl: {
    type: String,
    required: true
  },
  videoId: {
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
  },
  success: {
    type: Boolean,
    default: true
  }
});

// Index for checking recent boosts
boostSchema.index({ videoUrl: 1, timestamp: -1 });
boostSchema.index({ videoId: 1 });

module.exports = mongoose.model('Boost', boostSchema); 