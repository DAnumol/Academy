const express = require('express');
const { body } = require('express-validator');
const { createBatch, getAllBatches, getBatchById, updateBatch, deleteBatch } = require('../controllers/batchController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

const batchValidation = [
  body('batchName').notEmpty().withMessage('Batch name is required'),
  body('courseId').notEmpty().withMessage('Course ID is required'),
  body('startDate').isISO8601().withMessage('Valid start date is required'),
  body('endDate').isISO8601().withMessage('Valid end date is required')
];

router.post('/', authenticate, authorize('admin'), batchValidation, createBatch);
router.get('/', authenticate, authorize('admin', 'staff'), getAllBatches);
router.get('/:id', authenticate, authorize('admin', 'staff'), getBatchById);
router.put('/:id', authenticate, authorize('admin'), updateBatch);
router.delete('/:id', authenticate, authorize('admin'), deleteBatch);

module.exports = router;