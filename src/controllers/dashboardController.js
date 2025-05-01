const Event = require('../models/Event');
const Registration = require('../models/Registration');
const Speaker = require('../models/Speaker');
const Sponsor = require('../models/Sponsor');
const Contact = require('../models/Contact');

// @desc    Get dashboard summary statistics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
  try {
    // Get counts from all collections
    const eventCount = await Event.countDocuments();
    const registrationCount = await Registration.countDocuments();
    const speakerCount = await Speaker.countDocuments();
    const sponsorCount = await Sponsor.countDocuments();
    const contactCount = await Contact.countDocuments();
    const unreadContactCount = await Contact.countDocuments({ resolved: false });

    // Get the 5 most recent registrations
    const recentRegistrations = await Registration.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('event', 'title');

    // Get registrations by event
    const eventRegistrations = await Registration.aggregate([
      {
        $group: {
          _id: '$event',
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'events',
          localField: '_id',
          foreignField: '_id',
          as: 'eventDetails'
        }
      },
      {
        $unwind: '$eventDetails'
      },
      {
        $project: {
          eventTitle: '$eventDetails.title',
          count: 1
        }
      }
    ]);

    // Get registrations by payment status
    const paymentStatusData = await Registration.aggregate([
      {
        $group: {
          _id: '$paymentStatus',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get contacts by resolution status
    const contactStatusData = await Contact.aggregate([
      {
        $group: {
          _id: '$resolved',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      counts: {
        events: eventCount,
        registrations: registrationCount,
        speakers: speakerCount,
        sponsors: sponsorCount,
        contacts: contactCount,
        unreadContacts: unreadContactCount
      },
      recentRegistrations,
      eventRegistrations,
      paymentStatusData,
      contactStatusData
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get recent activity for the dashboard
// @route   GET /api/admin/dashboard/activity
// @access  Private/Admin
const getRecentActivity = async (req, res) => {
  try {
    // Get the 10 most recent registrations
    const recentRegistrations = await Registration.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('event', 'title');

    // Get the 10 most recent contact submissions
    const recentContacts = await Contact.find()
      .sort({ createdAt: -1 })
      .limit(10);

    // Format the data into an activity feed
    const activities = [
      ...recentRegistrations.map(reg => ({
        type: 'registration',
        id: reg._id,
        title: `New registration for ${reg.event.title}`,
        name: reg.name,
        email: reg.email,
        date: reg.createdAt,
        status: reg.registrationStatus
      })),
      ...recentContacts.map(contact => ({
        type: 'contact',
        id: contact._id,
        title: `New contact message: ${contact.subject}`,
        name: contact.name,
        email: contact.email,
        date: contact.createdAt,
        resolved: contact.resolved
      }))
    ];

    // Sort by date descending
    activities.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json(activities.slice(0, 10));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDashboardStats,
  getRecentActivity
}; 