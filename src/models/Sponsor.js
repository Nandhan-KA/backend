const mongoose = require('mongoose');

const sponsorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  logo: {
    type: String,
    required: true
  },
  website: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  tier: {
    type: String,
    required: true,
    enum: ['platinum', 'gold', 'silver', 'bronze', 'partner']
  }
}, {
  timestamps: true
});

const Sponsor = mongoose.model('Sponsor', sponsorSchema);

module.exports = Sponsor; 