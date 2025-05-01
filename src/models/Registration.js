const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  college: {
    type: String,
    required: true,
    trim: true
  },
  department: {
    type: String,
    required: true,
    trim: true
  },
  year: {
    type: String,
    required: true,
    enum: ['1', '2', '3', '4', '5', 'Others']
  },
  teamName: {
    type: String,
    trim: true
  },
  teamMembers: [{
    name: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    college: { type: String, trim: true }
  }],
  transactionId: {
    type: String,
    trim: true
  },
  paymentProof: {
    type: String,
    trim: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  registrationStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'rejected', 'waitlisted'],
    default: 'pending'
  },
  additionalInfo: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

const Registration = mongoose.model('Registration', registrationSchema);

module.exports = Registration; 