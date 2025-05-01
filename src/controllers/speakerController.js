const Speaker = require('../models/Speaker');

// @desc    Get all speakers
// @route   GET /api/speakers
// @access  Public
const getSpeakers = async (req, res) => {
  try {
    const speakers = await Speaker.find().sort({ featured: -1, name: 1 });
    res.json(speakers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get featured speakers
// @route   GET /api/speakers/featured
// @access  Public
const getFeaturedSpeakers = async (req, res) => {
  try {
    const speakers = await Speaker.find({ featured: true }).sort({ name: 1 });
    res.json(speakers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a single speaker
// @route   GET /api/speakers/:id
// @access  Public
const getSpeakerById = async (req, res) => {
  try {
    const speaker = await Speaker.findById(req.params.id);
    
    if (!speaker) {
      return res.status(404).json({ message: 'Speaker not found' });
    }
    
    res.json(speaker);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new speaker
// @route   POST /api/speakers
// @access  Private/Admin
const createSpeaker = async (req, res) => {
  try {
    const speaker = new Speaker(req.body);
    const createdSpeaker = await speaker.save();
    res.status(201).json(createdSpeaker);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a speaker
// @route   PUT /api/speakers/:id
// @access  Private/Admin
const updateSpeaker = async (req, res) => {
  try {
    const speaker = await Speaker.findById(req.params.id);
    
    if (!speaker) {
      return res.status(404).json({ message: 'Speaker not found' });
    }
    
    Object.keys(req.body).forEach(key => {
      speaker[key] = req.body[key];
    });
    
    const updatedSpeaker = await speaker.save();
    res.json(updatedSpeaker);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a speaker
// @route   DELETE /api/speakers/:id
// @access  Private/Admin
const deleteSpeaker = async (req, res) => {
  try {
    const speaker = await Speaker.findById(req.params.id);
    
    if (!speaker) {
      return res.status(404).json({ message: 'Speaker not found' });
    }
    
    await Speaker.findByIdAndDelete(req.params.id);
    res.json({ message: 'Speaker removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getSpeakers,
  getFeaturedSpeakers,
  getSpeakerById,
  createSpeaker,
  updateSpeaker,
  deleteSpeaker
}; 