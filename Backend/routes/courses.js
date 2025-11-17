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
  authorize('admin'), 
  courseValidation, 
  createCourse
);

router.get('/', 
  authenticate, 
  getAllCourses
);

router.get('/:id', 
  authenticate, 
  getCourseById
);

router.put('/:id', 
  authenticate, 
  authorize('admin'), 
  updateCourse
);

router.delete('/:id', 
  authenticate, 
  authorize('admin'), 
  deleteCourse
);

module.exports = router;