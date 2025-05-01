const express = require('express');
const router = express.Router();
const { 
  getSpeakers,
  getFeaturedSpeakers,
  getSpeakerById,
  createSpeaker,
  updateSpeaker,
  deleteSpeaker
} = require('../controllers/speakerController');

// Get all speakers and create a new speaker
router.route('/')
  .get(getSpeakers)
  .post(createSpeaker);

// Get featured speakers
router.route('/featured')
  .get(getFeaturedSpeakers);

// Get, update, and delete a specific speaker
router.route('/:id')
  .get(getSpeakerById)
  .put(updateSpeaker)
  .delete(deleteSpeaker);

module.exports = router; 