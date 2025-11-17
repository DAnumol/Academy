const express = require('express');
const { body } = require('express-validator');
const { createTimetable, getAllTimetables, getTimetableById, updateTimetable, deleteTimetable } = require('../controllers/timetableController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

const timetableValidation = [
  body('batchId').notEmpty().withMessage('Batch ID is required'),
  body('weekStartDate').isISO8601().withMessage('Valid week start date is required'),
  body('schedule').isArray().withMessage('Schedule must be an array')
];

router.post('/', authenticate, authorize('admin'), timetableValidation, createTimetable);
router.get('/', authenticate, getAllTimetables);
router.get('/:id', authenticate, getTimetableById);
router.put('/:id', authenticate, authorize('admin'), updateTimetable);
router.delete('/:id', authenticate, authorize('admin'), deleteTimetable);

module.exports = router;