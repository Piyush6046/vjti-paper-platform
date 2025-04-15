
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    default: null
  },
  branch: {
    type: String,
    enum: ['CS', 'IT', 'EXTC', 'Electrical', 'Production', 'Chemical', 'Metallurgy', 'Civil', 'Polytechnic'],
    default: null
  },
  year: {
    type: String,
    enum: ['1', '2', '3'],
    default: null
  },
  bio: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
