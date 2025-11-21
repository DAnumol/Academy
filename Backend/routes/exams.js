const express = require('express');
const { body } = require('express-validator');
const { createExam, getAllExams, getExamById, updateExam, deleteExam, toggleExamStatus, getStudentExams, submitExam } = require('../controllers/examController');
const { authenticate, authorize } = require('../middleware/auth');
 
const router = express.Router();
 
const examValidation = [
  body('qpId').notEmpty().withMessage('Question paper ID is required'),
  body('batchId').notEmpty().withMessage('Batch ID is required'),
  body('date').isISO8601().withMessage('Valid exam date is required')
];
 
router.post('/', authenticate, authorize('admin'), examValidation, createExam);
router.get('/', authenticate, getAllExams);
router.get('/student/my-exams', authenticate, authorize('student'), getStudentExams);
router.post('/student/submit', authenticate, authorize('student'), submitExam);
router.get('/:id', authenticate, getExamById);
router.put('/:id', authenticate, authorize('admin'), updateExam);
router.delete('/:id', authenticate, authorize('admin'), deleteExam);
router.patch('/:id/toggle-status', authenticate, authorize('admin'), toggleExamStatus);
 
module.exports = router;
 