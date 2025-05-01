const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  paymentQrCode: {
    type: String,
    default: ''
  },
  contactEmail: {
    type: String,
    default: 'contact@techshethra.com'
  },
  contactPhone: {
    type: String,
    default: '+91 9876543210'
  },
  upiId: {
    type: String,
    default: 'organizers@techshethra'
  },
  socialLinks: {
    instagram: { type: String, default: '' },
    twitter: { type: String, default: '' },
    facebook: { type: String, default: '' },
    linkedin: { type: String, default: '' }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Ensure only one settings document exists
settingsSchema.statics.getSiteSettings = async function() {
  const settings = await this.findOne();
  if (settings) {
    return settings;
  }
  return this.create({});
};

const Settings = mongoose.model('Settings', settingsSchema);

module.exports = Settings; 