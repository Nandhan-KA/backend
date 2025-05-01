const express = require('express');
const router = express.Router();
const { 
  submitContactForm,
  getContactSubmissions,
  getContactById,
  updateContactStatus,
  deleteContact
} = require('../controllers/contactController');

// Submit a contact form and get all submissions
router.route('/')
  .post(submitContactForm)
  .get(getContactSubmissions);

// Get, update, and delete a specific contact submission
router.route('/:id')
  .get(getContactById)
  .put(updateContactStatus)
  .delete(deleteContact);

module.exports = router; 