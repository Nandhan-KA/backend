const dotenv = require('dotenv');
const connectDB = require('./db');
const Admin = require('../models/Admin');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Create admin user
const createAdmin = async () => {
  try {
    // Check if any admin already exists
    const adminCount = await Admin.countDocuments({});
    
    if (adminCount > 0) {
      console.log('An admin user already exists. Skipping creation.');
      process.exit();
    }
    
    // Create the admin user
    const admin = await Admin.create({
      name: 'Nandhan K',
      email: 'nandhank@scholarpeak.in',
      password: '12345678',
      role: 'superadmin'
    });
    
    if (admin) {
      console.log(`Admin user created successfully: ${admin.email}`);
    } else {
      console.log('Failed to create admin user');
    }
    
    process.exit();
  } catch (error) {
    console.error(`Error creating admin user: ${error.message}`);
    process.exit(1);
  }
};

// Run the function
createAdmin(); 