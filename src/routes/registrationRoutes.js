const express = require('express');
const router = express.Router();
const { 
  getRegistrations,
  getRegistrationsByEvent, 
  createRegistration, 
  getRegistrationById,
  updateRegistrationStatus,
  deleteRegistration
} = require('../controllers/registrationController');
const { protect } = require('../middleware/authMiddleware');

// Get all registrations and create a new registration
router.route('/')
  .get(protect, getRegistrations)
  .post(createRegistration);

// Get registrations by event
router.route('/event/:eventId')
  .get(protect, getRegistrationsByEvent);

// Get, update status, and delete a specific registration
router.route('/:id')
  .get(protect, getRegistrationById)
  .put(protect, updateRegistrationStatus)
  .delete(protect, deleteRegistration);

module.exports = router; 