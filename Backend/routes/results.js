const express = require('express');
const { body } = require('express-validator');
const { createResult, getAllResults, getResultById, updateResult, deleteResult } = require('../controllers/resultController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

const resultValidation = [
  body('studentId').notEmpty().withMessage('Student ID is required'),
  body('examId').notEmpty().withMessage('Exam ID is required'),
  body('totalMarks').isNumeric().withMessage('Total marks must be a number'),
  body('obtainedMarks').isNumeric().withMessage('Obtained marks must be a number')
];

router.post('/', authenticate, authorize('admin', 'staff'), resultValidation, createResult);
router.get('/', authenticate, getAllResults);
router.get('/:id', authenticate, getResultById);
router.put('/:id', authenticate, authorize('admin', 'staff'), updateResult);
router.delete('/:id', authenticate, authorize('admin'), deleteResult);

module.exports = router;