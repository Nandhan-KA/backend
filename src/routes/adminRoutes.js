const express = require('express');
const router = express.Router();
const { 
  loginAdmin, 
  getAdminProfile, 
  registerAdmin, 
  setupAdmin,
  getAdminLoginHistory
} = require('../controllers/authController');
const {
  getDashboardStats,
  getRecentActivity
} = require('../controllers/dashboardController');
const { protect, superAdmin } = require('../middleware/authMiddleware');
const { getSettings, updateSettings, getPublicSettings } = require('../controllers/settingsController');

// Public routes
router.post('/login', loginAdmin);
router.post('/setup', setupAdmin);
router.get('/settings/public', getPublicSettings);

// Protected routes
router.get('/profile', protect, getAdminProfile);
router.post('/register', protect, superAdmin, registerAdmin);
router.get('/login-history', protect, getAdminLoginHistory);

// Dashboard routes
router.get('/dashboard', protect, getDashboardStats);
router.get('/dashboard/activity', protect, getRecentActivity);

// Settings routes
router.get('/settings', protect, getSettings);
router.put('/settings', protect, updateSettings);

module.exports = router; 