const Student = require('../models/Student');
const Event = require('../models/Event');
const Registration = require('../models/Registration');

// Register a new student
exports.register = async (req, res) => {
  try {
    console.log('Student registration request received:', req.body);
    
    // Check if student already exists
    const existingStudent = await Student.findOne({ email: req.body.email });
    if (existingStudent) {
      console.log('Registration failed: Email already exists:', req.body.email);
      return res.status(400).json({ message: 'Student with this email already exists' });
    }

    // Create new student
    const studentData = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      phone: req.body.phone,
      college: req.body.college,
      department: req.body.department,
      year: req.body.year
    };
    
    console.log('Creating new student with data:', { ...studentData, password: '[HIDDEN]' });
    
    const student = new Student(studentData);
    const savedStudent = await student.save();
    
    console.log('Student saved successfully with ID:', savedStudent._id);

    // Generate token
    const token = student.generateAuthToken();
    
    console.log('Authentication token generated for student');

    res.status(201).json({ 
      message: 'Student registered successfully',
      student: {
        id: student._id,
        name: student.name,
        email: student.email
      },
      token 
    });
  } catch (error) {
    console.error('Student registration error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Login student
exports.login = async (req, res) => {
  try {
    console.log('Student login attempt for email:', req.body.email);
    const { email, password } = req.body;

    // Find student by email
    const student = await Student.findOne({ email });
    if (!student) {
      console.log('Login failed: Student not found with email:', email);
      return res.status(400).json({ message: 'Invalid login credentials' });
    }

    // Verify password
    const isMatch = await student.comparePassword(password);
    if (!isMatch) {
      console.log('Login failed: Invalid password for student:', email);
      return res.status(400).json({ message: 'Invalid login credentials' });
    }

    console.log('Student login successful:', student._id);
    
    // Generate token
    const token = student.generateAuthToken();

    res.status(200).json({
      message: 'Login successful',
      student: {
        id: student._id,
        name: student.name,
        email: student.email
      },
      token
    });
  } catch (error) {
    console.error('Student login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get student profile
exports.getProfile = async (req, res) => {
  try {
    console.log('Get profile request for student ID:', req.student.id);
    
    const student = await Student.findById(req.student.id)
      .select('-password')
      .populate('registeredEvents');
    
    if (!student) {
      console.log('Profile fetch failed: Student not found with ID:', req.student.id);
      return res.status(404).json({ message: 'Student not found' });
    }

    console.log('Student profile fetched successfully');
    res.status(200).json({ student });
  } catch (error) {
    console.error('Get student profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update student profile
exports.updateProfile = async (req, res) => {
  try {
    console.log('Update profile request for student ID:', req.student.id);
    console.log('Update data:', req.body);
    
    // Prevent updating email and password through this route
    const updates = { ...req.body };
    delete updates.email;
    delete updates.password;
    
    const student = await Student.findByIdAndUpdate(
      req.student.id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    if (!student) {
      console.log('Update profile failed: Student not found with ID:', req.student.id);
      return res.status(404).json({ message: 'Student not found' });
    }

    console.log('Student profile updated successfully');
    res.status(200).json({ 
      message: 'Profile updated successfully',
      student 
    });
  } catch (error) {
    console.error('Update student profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Register for an event
exports.registerForEvent = async (req, res) => {
  try {
    const {
      eventId,
      name,
      email,
      phone,
      college,
      department,
      year,
      teamName,
      transactionId,
      additionalInfo
    } = req.body;

    // Parse teamMembers JSON if provided
    let teamMembers = [];
    if (req.body.teamMembers) {
      try {
        teamMembers = JSON.parse(req.body.teamMembers);
      } catch (e) {
        return res.status(400).json({ message: 'Invalid team members data' });
      }
    }

    // Check if the event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if the student is already registered for this event
    const existingRegistration = await Registration.findOne({
      event: eventId,
      email: email
    });

    if (existingRegistration) {
      return res.status(400).json({ message: 'You are already registered for this event' });
    }

    // Create registration data
    const registrationData = {
      event: eventId,
      name,
      email,
      phone,
      college,
      department,
      year,
      teamName: teamName || '',
      teamMembers: teamMembers || [],
      transactionId: transactionId || '',
      paymentStatus: event.registrationFee > 0 ? 'pending' : 'completed',
      registrationStatus: 'pending',
      additionalInfo: additionalInfo || ''
    };

    // Add payment screenshot file path if uploaded
    if (req.file) {
      registrationData.paymentProof = req.file.path;
    }

    // Save registration
    const registration = new Registration(registrationData);
    const savedRegistration = await registration.save();

    // Add registration to student's registrations
    const student = await Student.findById(req.student._id);
    student.registrations.push(savedRegistration._id);
    await student.save();

    res.status(201).json({
      success: true,
      registration: {
        _id: savedRegistration._id,
        event: event.title,
        registrationStatus: savedRegistration.registrationStatus,
        paymentStatus: savedRegistration.paymentStatus
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get all registered events for student
exports.getRegisteredEvents = async (req, res) => {
  try {
    const student = await Student.findById(req.student._id);
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Fetch registrations with populated event details
    const registrations = await Registration.find({
      _id: { $in: student.registrations }
    }).populate('event', 'title eventType image location registrationFee date isTeamEvent teamSize');

    res.json({
      success: true,
      registrations
    });
  } catch (error) {
    console.error('Error fetching registered events:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify/Approve a student account
// @route   PUT /api/students/:id/verify
// @access  Private/Admin
const verifyStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    student.isVerified = true;
    
    const updatedStudent = await student.save();
    
    res.json({
      message: 'Student account verified successfully',
      student: {
        _id: updatedStudent._id,
        name: updatedStudent.name,
        email: updatedStudent.email,
        isVerified: updatedStudent.isVerified
      }
    });
  } catch (error) {
    console.error('Error verifying student:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  registerStudent: async (req, res) => {
    try {
      console.log('Student registration request received:', req.body);
      
      // Check if student already exists
      const existingStudent = await Student.findOne({ email: req.body.email });
      if (existingStudent) {
        console.log('Registration failed: Email already exists:', req.body.email);
        return res.status(400).json({ message: 'Student with this email already exists' });
      }
  
      // Create new student
      const studentData = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        phone: req.body.phone,
        college: req.body.college,
        department: req.body.department,
        year: req.body.year
      };
      
      console.log('Creating new student with data:', { ...studentData, password: '[HIDDEN]' });
      
      const student = new Student(studentData);
      const savedStudent = await student.save();
      
      console.log('Student saved successfully with ID:', savedStudent._id);
  
      // Generate token
      const token = student.generateAuthToken();
      
      console.log('Authentication token generated for student');
  
      res.status(201).json({ 
        message: 'Student registered successfully',
        student: {
          id: student._id,
          name: student.name,
          email: student.email
        },
        token 
      });
    } catch (error) {
      console.error('Student registration error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },
  loginStudent: exports.login,
  getStudentProfile: exports.getProfile,
  updateStudent: exports.updateProfile,
  registerForEvent: exports.registerForEvent,
  getRegisteredEvents: exports.getRegisteredEvents,
  verifyStudent,
  getStudentById: exports.getProfile,
  getStudents: async (req, res) => {
    try {
      const students = await Student.find();
      res.json(students);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  deleteStudent: async (req, res) => {
    try {
      const student = await Student.findById(req.params.id);
      
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }
      
      await Student.findByIdAndDelete(req.params.id);
      res.json({ message: 'Student removed' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}; 