const express = require('express');
const { body } = require('express-validator');
const { createQuestionPaper, getAllQuestionPapers, getQuestionPaperById, updateQuestionPaper, deleteQuestionPaper } = require('../controllers/questionPaperController');
const { authenticate, authorize } = require('../middleware/auth');
const { checkPermission, PERMISSIONS } = require('../middleware/permissions');
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

router.post('/', authenticate, checkPermission(PERMISSIONS.CREATE_QUESTION_PAPER), upload.any(), questionPaperValidation, createQuestionPaper);
router.get('/', authenticate, checkPermission(PERMISSIONS.VIEW_QUESTION_PAPERS), getAllQuestionPapers);
router.get('/:id', authenticate, checkPermission(PERMISSIONS.VIEW_QUESTION_PAPERS), getQuestionPaperById);
router.put('/:id', authenticate, checkPermission(PERMISSIONS.EDIT_QUESTION_PAPER), upload.any(), updateQuestionPaper);
router.delete('/:id', authenticate, checkPermission(PERMISSIONS.DELETE_QUESTION_PAPER), deleteQuestionPaper);

module.exports = router;