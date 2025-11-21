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
const { checkPermission, PERMISSIONS } = require('../middleware/permissions');
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
  checkPermission(PERMISSIONS.CREATE_STUDENT), 
  upload.single('profilePic'), 
  studentValidation, 
  createStudent
);

router.get('/', 
  authenticate, 
  checkPermission(PERMISSIONS.VIEW_STUDENTS), 
  getAllStudents
);

router.get('/:id', 
  authenticate, 
  checkPermission(PERMISSIONS.VIEW_STUDENTS), 
  getStudentById
);

router.put('/:id', 
  authenticate, 
  checkPermission(PERMISSIONS.EDIT_STUDENT), 
  upload.single('profilePic'), 
  updateStudent
);

router.delete('/:id', 
  authenticate, 
  checkPermission(PERMISSIONS.DELETE_STUDENT), 
  deleteStudent
);

module.exports = router;