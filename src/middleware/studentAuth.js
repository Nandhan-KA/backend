const jwt = require('jsonwebtoken');
const Student = require('../models/Student');

const studentAuth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if role is student
    if (decoded.role !== 'student') {
      return res.status(403).json({ message: 'Not authorized as student' });
    }

    // Find student by id
    const student = await Student.findById(decoded.id);
    
    if (!student) {
      return res.status(401).json({ message: 'Authentication failed' });
    }

    // Attach student to request
    req.token = token;
    req.student = {
      id: student._id,
      name: student.name,
      email: student.email,
      college: student.college,
      department: student.department,
      year: student.year,
      phone: student.phone
    };

    next();
  } catch (error) {
    res.status(401).json({ message: 'Authentication failed', error: error.message });
  }
};

module.exports = studentAuth; 