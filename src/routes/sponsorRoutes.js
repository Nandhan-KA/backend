const express = require('express');
const router = express.Router();
const { 
  getSponsors,
  getSponsorsByTier,
  getSponsorById,
  createSponsor,
  updateSponsor,
  deleteSponsor
} = require('../controllers/sponsorController');

// Get all sponsors and create a new sponsor
router.route('/')
  .get(getSponsors)
  .post(createSponsor);

// Get sponsors by tier
router.route('/tier/:tier')
  .get(getSponsorsByTier);

// Get, update, and delete a specific sponsor
router.route('/:id')
  .get(getSponsorById)
  .put(updateSponsor)
  .delete(deleteSponsor);

module.exports = router; 