const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @desc    Auth admin & get token
// @route   POST /api/admin/login
// @access  Public
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if admin exists
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if password matches
    const isMatch = await admin.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Get IP address from request
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'Unknown';
    
    // Update last login time and IP
    admin.lastLogin = Date.now();
    admin.lastLoginIp = ip;
    
    // Add to login history
    admin.loginHistory.push({
      ip,
      timestamp: Date.now()
    });
    
    // Limit history to last 50 entries if it gets too long
    if (admin.loginHistory.length > 50) {
      admin.loginHistory = admin.loginHistory.slice(-50);
    }
    
    await admin.save();

    res.json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      token: generateToken(admin._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get admin profile
// @route   GET /api/admin/profile
// @access  Private
const getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id).select('-password');
    
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    
    res.json(admin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Register a new admin (used only for initialization or by superadmin)
// @route   POST /api/admin/register
// @access  Private/SuperAdmin
const registerAdmin = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if admin already exists
    const adminExists = await Admin.findOne({ email });

    if (adminExists) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    // Create admin
    const admin = await Admin.create({
      name,
      email,
      password,
      role: role || 'admin'
    });

    if (admin) {
      res.status(201).json({
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        token: generateToken(admin._id)
      });
    } else {
      res.status(400).json({ message: 'Invalid admin data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create initial admin (special route for first-time setup)
// @route   POST /api/admin/setup
// @access  Public (only works if no admins exist)
const setupAdmin = async (req, res) => {
  try {
    // Check if any admin already exists
    const adminCount = await Admin.countDocuments({});
    
    if (adminCount > 0) {
      return res.status(400).json({ message: 'Admin setup has already been completed' });
    }
    
    const { name, email, password } = req.body;
    
    // Create the first admin as superadmin
    const admin = await Admin.create({
      name,
      email,
      password,
      role: 'superadmin'
    });
    
    if (admin) {
      res.status(201).json({
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        token: generateToken(admin._id)
      });
    } else {
      res.status(400).json({ message: 'Invalid admin data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get admin login history
// @route   GET /api/admin/login-history
// @access  Private/Admin
const getAdminLoginHistory = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id).select('loginHistory lastLogin lastLoginIp');
    
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    
    res.json({
      lastLogin: admin.lastLogin,
      lastLoginIp: admin.lastLoginIp,
      loginHistory: admin.loginHistory
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  loginAdmin,
  getAdminProfile,
  registerAdmin,
  setupAdmin,
  getAdminLoginHistory
}; 