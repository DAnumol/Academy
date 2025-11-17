const express = require('express');
const { body } = require('express-validator');
const { createSubject, getAllSubjects, getSubjectById, updateSubject, deleteSubject } = require('../controllers/subjectController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

const subjectValidation = [
  body('name').notEmpty().withMessage('Subject name is required'),
  body('code').notEmpty().withMessage('Subject code is required')
];

router.post('/', authenticate, authorize('admin'), subjectValidation, createSubject);
router.get('/', authenticate, getAllSubjects);
router.get('/:id', authenticate, getSubjectById);
router.put('/:id', authenticate, authorize('admin'), updateSubject);
router.delete('/:id', authenticate, authorize('admin'), deleteSubject);

module.exports = router;