// models/User.js
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
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'owner'],
    default: 'user'
  },
  phone: {
    type: String,
    default: ''
  },
  // NEW: Track if Google OAuth user has selected their role
  roleSelected: {
    type: Boolean,
    default: false
  },
  // Track authentication method
  authMethod: {
    type: String,
    enum: ['email', 'google'],
    default: 'email'
  }
}, {
  timestamps: true
});

// Index for faster queries
userSchema.index({ email: 1 });

module.exports = mongoose.model('User', userSchema);