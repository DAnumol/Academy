const express = require('express');
const { body } = require('express-validator');
const { createClass, getAllClasses, getClassById, updateClass, deleteClass } = require('../controllers/classController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

const classValidation = [
  body('className').notEmpty().withMessage('Class name is required'),
  body('batchId').notEmpty().withMessage('Batch ID is required')
];

router.post('/', authenticate, authorize('admin'), classValidation, createClass);
router.get('/', authenticate, authorize('admin', 'staff'), getAllClasses);
router.get('/:id', authenticate, authorize('admin', 'staff'), getClassById);
router.put('/:id', authenticate, authorize('admin'), updateClass);
router.delete('/:id', authenticate, authorize('admin'), deleteClass);

module.exports = router;