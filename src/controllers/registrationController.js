const Registration = require('../models/Registration');
const Event = require('../models/Event');

// @desc    Get all registrations
// @route   GET /api/registration
// @access  Private/Admin
const getRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find().populate('event', 'title');
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get registrations by event
// @route   GET /api/registration/event/:eventId
// @access  Private/Admin
const getRegistrationsByEvent = async (req, res) => {
  try {
    const registrations = await Registration.find({ event: req.params.eventId }).populate('event', 'title');
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new registration
// @route   POST /api/registration
// @access  Public
const createRegistration = async (req, res) => {
  try {
    // Check if the event exists
    const event = await Event.findById(req.body.event);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    // Check if the user is already registered for this event
    const existingRegistration = await Registration.findOne({
      event: req.body.event,
      email: req.body.email
    });
    
    if (existingRegistration) {
      return res.status(400).json({ message: 'You are already registered for this event' });
    }
    
    const registration = new Registration(req.body);
    const createdRegistration = await registration.save();
    
    res.status(201).json({
      _id: createdRegistration._id,
      name: createdRegistration.name,
      email: createdRegistration.email,
      event: createdRegistration.event,
      registrationStatus: createdRegistration.registrationStatus,
      createdAt: createdRegistration.createdAt
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get a registration by ID
// @route   GET /api/registration/:id
// @access  Private/Admin or User
const getRegistrationById = async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id).populate('event', 'title');
    
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }
    
    res.json(registration);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update registration status
// @route   PUT /api/registration/:id
// @access  Private/Admin
const updateRegistrationStatus = async (req, res) => {
  try {
    const { registrationStatus, paymentStatus } = req.body;
    
    const registration = await Registration.findById(req.params.id);
    
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }
    
    if (registrationStatus) {
      registration.registrationStatus = registrationStatus;
    }
    
    if (paymentStatus) {
      registration.paymentStatus = paymentStatus;
    }
    
    const updatedRegistration = await registration.save();
    res.json(updatedRegistration);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a registration
// @route   DELETE /api/registration/:id
// @access  Private/Admin
const deleteRegistration = async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id);
    
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }
    
    await Registration.findByIdAndDelete(req.params.id);
    res.json({ message: 'Registration removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getRegistrations,
  getRegistrationsByEvent,
  createRegistration,
  getRegistrationById,
  updateRegistrationStatus,
  deleteRegistration
}; 