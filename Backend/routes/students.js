const express = require('express');
const { body } = require('express-validator');
const { 
  createStudent, 
  getAllStudents, 
  getStudentById, 
  updateStudent, 
  deleteStudent 
} = require('../controllers/studentController');
const { authenticate, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Validation middleware
const studentValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('dob').isISO8601().withMessage('Please provide a valid date of birth'),
  body('gender').isIn(['Male', 'Female', 'Other']).withMessage('Invalid gender'),
  body('phone').isMobilePhone().withMessage('Please provide a valid phone number'),
  body('rollNo').notEmpty().withMessage('Roll number is required')
];

// Routes
router.post('/', 
  authenticate, 
  authorize('admin'), 
  upload.single('profilePic'), 
  studentValidation, 
  createStudent
);

router.get('/', 
  authenticate, 
  authorize('admin', 'staff'), 
  getAllStudents
);

router.get('/:id', 
  authenticate, 
  authorize('admin', 'staff', 'student'), 
  getStudentById
);

router.put('/:id', 
  authenticate, 
  authorize('admin'), 
  upload.single('profilePic'), 
  updateStudent
);

router.delete('/:id', 
  authenticate, 
  authorize('admin'), 
  deleteStudent
);

module.exports = router;