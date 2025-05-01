const Sponsor = require('../models/Sponsor');

// @desc    Get all sponsors
// @route   GET /api/sponsors
// @access  Public
const getSponsors = async (req, res) => {
  try {
    const sponsors = await Sponsor.find().sort({ 
      tier: 1, // Sort by tier (assuming: platinum, gold, silver, bronze order)
      name: 1  // Then alphabetically by name
    });
    res.json(sponsors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get sponsors by tier
// @route   GET /api/sponsors/tier/:tier
// @access  Public
const getSponsorsByTier = async (req, res) => {
  try {
    const sponsors = await Sponsor.find({ tier: req.params.tier }).sort({ name: 1 });
    res.json(sponsors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a single sponsor
// @route   GET /api/sponsors/:id
// @access  Public
const getSponsorById = async (req, res) => {
  try {
    const sponsor = await Sponsor.findById(req.params.id);
    
    if (!sponsor) {
      return res.status(404).json({ message: 'Sponsor not found' });
    }
    
    res.json(sponsor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new sponsor
// @route   POST /api/sponsors
// @access  Private/Admin
const createSponsor = async (req, res) => {
  try {
    const sponsor = new Sponsor(req.body);
    const createdSponsor = await sponsor.save();
    res.status(201).json(createdSponsor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a sponsor
// @route   PUT /api/sponsors/:id
// @access  Private/Admin
const updateSponsor = async (req, res) => {
  try {
    const sponsor = await Sponsor.findById(req.params.id);
    
    if (!sponsor) {
      return res.status(404).json({ message: 'Sponsor not found' });
    }
    
    Object.keys(req.body).forEach(key => {
      sponsor[key] = req.body[key];
    });
    
    const updatedSponsor = await sponsor.save();
    res.json(updatedSponsor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a sponsor
// @route   DELETE /api/sponsors/:id
// @access  Private/Admin
const deleteSponsor = async (req, res) => {
  try {
    const sponsor = await Sponsor.findById(req.params.id);
    
    if (!sponsor) {
      return res.status(404).json({ message: 'Sponsor not found' });
    }
    
    await Sponsor.findByIdAndDelete(req.params.id);
    res.json({ message: 'Sponsor removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getSponsors,
  getSponsorsByTier,
  getSponsorById,
  createSponsor,
  updateSponsor,
  deleteSponsor
}; 