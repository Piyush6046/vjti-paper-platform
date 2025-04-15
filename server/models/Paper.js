
const mongoose = require('mongoose');

const paperSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  branch: {
    type: String,
    required: true,
    enum: ['CS', 'IT', 'EXTC', 'Electrical', 'Production', 'Chemical', 'Metallurgy', 'Civil', 'Polytechnic']
  },
  semester: {
    type: String,
    enum: ['1', '2', '3', '4'],
    default: null
  },
  year: {
    type: String,
    enum: ['1', '2', '3'],
    default: null
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fileUrl: {
    type: String,
    required: true
  },
  uploadDate: {
    type: Date,
    default: Date.now
  },
  rating: {
    type: Number,
    default: 0
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  downloadCount: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model('Paper', paperSchema);
