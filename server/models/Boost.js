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
    required: true
  },
  success: {
    type: Boolean,
    default: false
  },
  clientIP: {
    type: String,
    required: false
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Indexes for efficient querying
boostSchema.index({ videoUrl: 1, timestamp: -1 });
boostSchema.index({ clientIP: 1, timestamp: -1 });
boostSchema.index({ videoId: 1 });

module.exports = mongoose.model('Boost', boostSchema); 