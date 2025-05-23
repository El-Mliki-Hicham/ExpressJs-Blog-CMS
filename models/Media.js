const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true
  },
  originalname: {
    type: String,
    required: true
  },
  mimetype: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  uploadDate: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Media', mediaSchema);
