const express = require('express');
const router = express.Router();
const { 
  getEvents, 
  getEventById, 
  createEvent, 
  updateEvent, 
  deleteEvent 
} = require('../controllers/eventController');
const { protect, admin } = require('../middleware/authMiddleware');

// Get all events and create a new event
router.route('/')
  .get(getEvents)
  .post(protect, admin, createEvent);

// Get, update, and delete a specific event
router.route('/:id')
  .get(getEventById)
  .put(protect, admin, updateEvent)
  .delete(protect, admin, deleteEvent);

module.exports = router; 