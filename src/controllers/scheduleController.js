const Schedule = require('../models/Schedule');

// @desc    Get the full schedule
// @route   GET /api/schedule
// @access  Public
const getSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.find()
      .populate('event', 'title description eventType')
      .populate('speakersOrJudges', 'name title company image')
      .sort({ day: 1, startTime: 1 });
    
    res.json(schedule);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get schedule by day
// @route   GET /api/schedule/day/:day
// @access  Public
const getScheduleByDay = async (req, res) => {
  try {
    const daySchedule = await Schedule.find({ day: req.params.day })
      .populate('event', 'title description eventType')
      .populate('speakersOrJudges', 'name title company image')
      .sort({ startTime: 1 });
    
    res.json(daySchedule);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get schedule for a specific event
// @route   GET /api/schedule/event/:eventId
// @access  Public
const getScheduleByEvent = async (req, res) => {
  try {
    const eventSchedule = await Schedule.find({ event: req.params.eventId })
      .populate('event', 'title description eventType')
      .populate('speakersOrJudges', 'name title company image')
      .sort({ day: 1, startTime: 1 });
    
    res.json(eventSchedule);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new schedule item
// @route   POST /api/schedule
// @access  Private/Admin
const createScheduleItem = async (req, res) => {
  try {
    const schedule = new Schedule(req.body);
    const createdSchedule = await schedule.save();
    
    res.status(201).json(createdSchedule);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a schedule item
// @route   PUT /api/schedule/:id
// @access  Private/Admin
const updateScheduleItem = async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id);
    
    if (!schedule) {
      return res.status(404).json({ message: 'Schedule item not found' });
    }
    
    Object.keys(req.body).forEach(key => {
      schedule[key] = req.body[key];
    });
    
    const updatedSchedule = await schedule.save();
    res.json(updatedSchedule);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a schedule item
// @route   DELETE /api/schedule/:id
// @access  Private/Admin
const deleteScheduleItem = async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id);
    
    if (!schedule) {
      return res.status(404).json({ message: 'Schedule item not found' });
    }
    
    await Schedule.findByIdAndDelete(req.params.id);
    res.json({ message: 'Schedule item removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getSchedule,
  getScheduleByDay,
  getScheduleByEvent,
  createScheduleItem,
  updateScheduleItem,
  deleteScheduleItem
}; 