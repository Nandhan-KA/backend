const express = require('express');
const router = express.Router();
const { 
  getSchedule, 
  getScheduleByDay,
  getScheduleByEvent,
  createScheduleItem,
  updateScheduleItem,
  deleteScheduleItem
} = require('../controllers/scheduleController');

// Get the full schedule and create a new schedule item
router.route('/')
  .get(getSchedule)
  .post(createScheduleItem);

// Get schedule by day
router.route('/day/:day')
  .get(getScheduleByDay);

// Get schedule by event
router.route('/event/:eventId')
  .get(getScheduleByEvent);

// Update and delete a specific schedule item
router.route('/:id')
  .put(updateScheduleItem)
  .delete(deleteScheduleItem);

module.exports = router; 