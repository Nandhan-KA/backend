const mongoose = require('mongoose');

const speakerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  company: {
    type: String,
    required: true,
    trim: true
  },
  bio: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  socialLinks: {
    linkedin: { type: String },
    twitter: { type: String },
    github: { type: String },
    website: { type: String }
  },
  talkTitle: {
    type: String,
    trim: true
  },
  talkDescription: {
    type: String
  },
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const Speaker = mongoose.model('Speaker', speakerSchema);

module.exports = Speaker; 