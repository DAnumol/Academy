const express = require('express');
const { body } = require('express-validator');
const { createQuestionPaper, getAllQuestionPapers, getQuestionPaperById, updateQuestionPaper, deleteQuestionPaper } = require('../controllers/questionPaperController');
const { authenticate, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

const questionPaperValidation = [
  body('subjectId').notEmpty().withMessage('Subject ID is required'),
  body('batchId').notEmpty().withMessage('Batch ID is required'),
  body('title').notEmpty().withMessage('Title is required'),
  body('examDate').isISO8601().withMessage('Valid exam date is required'),
  body('totalMarks').isNumeric().withMessage('Total marks must be a number'),
  body('duration').isNumeric().withMessage('Duration must be a number')
];

router.post('/', authenticate, authorize('admin', 'staff'), upload.single('questionPaper'), questionPaperValidation, createQuestionPaper);
router.get('/', authenticate, getAllQuestionPapers);
router.get('/:id', authenticate, getQuestionPaperById);
router.put('/:id', authenticate, authorize('admin', 'staff'), upload.single('questionPaper'), updateQuestionPaper);
router.delete('/:id', authenticate, authorize('admin', 'staff'), deleteQuestionPaper);

module.exports = router;