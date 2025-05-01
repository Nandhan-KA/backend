const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { 
  getStudents, 
  getStudentById, 
  registerStudent, 
  loginStudent, 
  updateStudent, 
  deleteStudent,
  verifyStudent,
  getStudentProfile,
  registerForEvent,
  getRegisteredEvents
} = require('../controllers/studentController');
const { protect, admin, studentProtect } = require('../middleware/authMiddleware');

// Configure multer storage for payment screenshots
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/payments');
  },
  filename: function (req, file, cb) {
    cb(null, `payment-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    
    cb(new Error('Only images are allowed'));
  }
});

// Public routes
router.route('/register').post(registerStudent);
router.route('/login').post(loginStudent);

// Protected student routes
router.route('/profile').get(studentProtect, getStudentProfile);

// Event registration routes
router.route('/events/register').post(studentProtect, upload.single('paymentScreenshot'), registerForEvent);
router.route('/events/registered').get(studentProtect, getRegisteredEvents);

// Admin routes
router.route('/').get(protect, admin, getStudents);
router.route('/:id')
  .get(protect, admin, getStudentById)
  .put(protect, admin, updateStudent)
  .delete(protect, admin, deleteStudent);
router.route('/:id/verify').put(protect, admin, verifyStudent);

module.exports = router; 