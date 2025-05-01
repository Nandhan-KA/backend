const express = require('express');
const router = express.Router();
const { 
  getEvents, 
  getEventById, 
  createEvent, 
  updateEvent, 
  deleteEvent 
} = require('../controllers/eventController');

// Get all events and create a new event
router.route('/')
  .get(getEvents)
  .post(createEvent);

// Get, update, and delete a specific event
router.route('/:id')
  .get(getEventById)
  .put(updateEvent)
  .delete(deleteEvent);

module.exports = router; 