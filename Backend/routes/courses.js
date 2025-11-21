const express = require('express');
const { body } = require('express-validator');
const { 
  createCourse, 
  getAllCourses, 
  getCourseById, 
  updateCourse, 
  deleteCourse 
} = require('../controllers/courseController');
const { authenticate, authorize } = require('../middleware/auth');
const { checkPermission, PERMISSIONS } = require('../middleware/permissions');

const router = express.Router();

// Validation middleware
const courseValidation = [
  body('courseName').notEmpty().withMessage('Course name is required'),
  body('duration').notEmpty().withMessage('Duration is required'),
  body('fees').isNumeric().withMessage('Fees must be a number')
];

// Routes
router.post('/', 
  authenticate, 
  checkPermission(PERMISSIONS.CREATE_COURSE), 
  courseValidation, 
  createCourse
);

router.get('/', 
  authenticate, 
  checkPermission(PERMISSIONS.VIEW_COURSES), 
  getAllCourses
);

router.get('/:id', 
  authenticate, 
  checkPermission(PERMISSIONS.VIEW_COURSES), 
  getCourseById
);

router.put('/:id', 
  authenticate, 
  checkPermission(PERMISSIONS.EDIT_COURSE), 
  updateCourse
);

router.delete('/:id', 
  authenticate, 
  checkPermission(PERMISSIONS.DELETE_COURSE), 
  deleteCourse
);

module.exports = router;