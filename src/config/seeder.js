const dotenv = require('dotenv');
const connectDB = require('./db');
const { events, speakers, sponsors, schedule } = require('./sampleData');

// Import models
const Event = require('../models/Event');
const Speaker = require('../models/Speaker');
const Sponsor = require('../models/Sponsor');
const Schedule = require('../models/Schedule');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Function to seed the database
const seedDatabase = async () => {
  try {
    // Delete existing data
    await Event.deleteMany({});
    await Speaker.deleteMany({});
    await Sponsor.deleteMany({});
    await Schedule.deleteMany({});
    
    console.log('Data cleared from the database...');
    
    // Insert seed data for speakers
    const createdSpeakers = await Speaker.insertMany(speakers);
    console.log(`${createdSpeakers.length} speakers inserted`);
    
    // Insert seed data for events
    const createdEvents = await Event.insertMany(events);
    console.log(`${createdEvents.length} events inserted`);
    
    // Insert seed data for sponsors
    const createdSponsors = await Sponsor.insertMany(sponsors);
    console.log(`${createdSponsors.length} sponsors inserted`);
    
    // Connect events and speakers to schedule
    const scheduleWithReferences = schedule.map((item, index) => ({
      ...item,
      event: createdEvents[index % createdEvents.length]._id,
      speakersOrJudges: [createdSpeakers[index % createdSpeakers.length]._id]
    }));
    
    // Insert seed data for schedule
    const createdSchedule = await Schedule.insertMany(scheduleWithReferences);
    console.log(`${createdSchedule.length} schedule items inserted`);
    
    console.log('Database seeded successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error seeding database: ${error.message}`);
    process.exit(1);
  }
};

// Function to clear the database
const clearDatabase = async () => {
  try {
    // Delete existing data
    await Event.deleteMany({});
    await Speaker.deleteMany({});
    await Sponsor.deleteMany({});
    await Schedule.deleteMany({});
    
    console.log('All data cleared from the database!');
    process.exit();
  } catch (error) {
    console.error(`Error clearing database: ${error.message}`);
    process.exit(1);
  }
};

// Check if we want to clear or seed the database
if (process.argv[2] === '-c') {
  clearDatabase();
} else {
  seedDatabase();
} 