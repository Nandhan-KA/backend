const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  eventType: {
    type: String,
    required: true,
    enum: ['workshop', 'competition', 'hackathon', 'talk', 'panel', 'technical', 'nontechnical']
  },
  capacity: {
    type: Number,
    required: true
  },
  registrationFees: {
    solo: { type: Number, default: 0 },
    team: { type: Number, default: 0 }
  },
  qrCode: {
    type: String,
    default: ''
  },
  upiId: {
    type: String,
    default: ''
  },
  date: {
    type: Date
  },
  location: {
    type: String,
    default: ''
  },
  aboutContent: {
    type: String,
    default: ''
  },
  detailsContent: {
    type: String,
    default: ''
  },
  rules: {
    type: [String],
    default: []
  },
  prizes: {
    first: { type: String, default: '' },
    second: { type: String, default: '' },
    third: { type: String, default: '' },
    other: { type: String, default: '' }
  },
  coordinators: [{
    name: { type: String, required: true },
    contact: { type: String, required: true },
    email: { type: String }
  }],
  startTime: {
    type: String,
    default: ''
  },
  endTime: {
    type: String,
    default: ''
  },
  requirements: {
    type: [String],
    default: []
  },
  isTeamEvent: {
    type: Boolean,
    default: false
  },
  teamSize: {
    min: { type: Number, default: 1 },
    max: { type: Number, default: 1 }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event; 