const Event = require('../models/Event');

// Validate URL to prevent malicious URLs
const validateUrl = (url) => {
  // Check if URL is valid
  try {
    const parsedUrl = new URL(url);
    // Only allow https URLs from trusted domains for QR codes
    // Add your trusted domains here (e.g., imagekit.io, cloudinary.com, your own domain)
    const trustedDomains = [
      'imagekit.io',
      'cloudinary.com',
      'amazonaws.com',
      'techshethra.com',
      'techshethra-api.com',
      'via.placeholder.com'
    ];
    
    // Check if domain is trusted
    const hostname = parsedUrl.hostname;
    const isDomainTrusted = trustedDomains.some(domain => hostname.includes(domain));
    
    if (!isDomainTrusted) {
      return {
        isValid: false,
        message: 'QR code URL must be from a trusted domain'
      };
    }
    
    // Must be https for security
    if (parsedUrl.protocol !== 'https:') {
      return {
        isValid: false,
        message: 'QR code URL must use HTTPS'
      };
    }
    
    return { isValid: true };
  } catch (error) {
    return {
      isValid: false,
      message: 'Invalid URL format'
    };
  }
};

// @desc    Get all events
// @route   GET /api/events
// @access  Public
const getEvents = async (req, res) => {
  try {
    const events = await Event.find({ isActive: true });
    console.log(`Retrieved ${events.length} events`);
    res.json(events);
  } catch (error) {
    console.error('Error retrieving events:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a single event
// @route   GET /api/events/:id
// @access  Public
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new event
// @route   POST /api/events
// @access  Private/Admin
const createEvent = async (req, res) => {
  try {
    const eventData = { ...req.body };
    
    // Validate QR code URL if provided
    if (eventData.qrCode && eventData.qrCode.trim() !== '') {
      const urlValidation = validateUrl(eventData.qrCode);
      if (!urlValidation.isValid) {
        return res.status(400).json({ message: urlValidation.message });
      }
    }
    
    // Create and save the event
    const event = new Event(eventData);
    const createdEvent = await event.save();
    
    // Log the admin who created this event
    console.log(`Event created by admin: ${req.admin._id}, ${req.admin.name}`);
    
    res.status(201).json(createdEvent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update an event
// @route   PUT /api/events/:id
// @access  Private/Admin
const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    const updateData = { ...req.body };
    
    // Prevent changing QR code if already set - security measure
    if (updateData.qrCode !== undefined && event.qrCode && event.qrCode.trim() !== '') {
      // QR code is already set and someone is trying to change it
      if (updateData.qrCode !== event.qrCode) {
        return res.status(403).json({ 
          message: 'Payment QR codes cannot be modified once set for security reasons.' +
                  ' Please contact the system administrator for assistance.' 
        });
      }
    }
    
    // If QR code is being set for the first time, validate it
    if (updateData.qrCode && (!event.qrCode || event.qrCode.trim() === '')) {
      const urlValidation = validateUrl(updateData.qrCode);
      if (!urlValidation.isValid) {
        return res.status(400).json({ message: urlValidation.message });
      }
      
      // Log initial QR code setting
      console.log(`QR code set for the first time for event ${event._id} by admin ${req.admin._id} (${req.admin.name})`);
      console.log(`New QR: ${updateData.qrCode}`);
    }
    
    // Update event fields
    Object.keys(updateData).forEach(key => {
      event[key] = updateData[key];
    });
    
    const updatedEvent = await event.save();
    res.json(updatedEvent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private/Admin
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    await Event.findByIdAndDelete(req.params.id);
    
    // Log the deletion for audit purposes
    console.log(`Event ${event._id} deleted by admin ${req.admin._id} (${req.admin.name})`);
    
    res.json({ message: 'Event removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent
}; 