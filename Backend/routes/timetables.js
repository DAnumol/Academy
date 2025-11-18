const express = require('express');
const { body } = require('express-validator');
const { createTimetable, getAllTimetables, getTimetableById, updateTimetable, deleteTimetable } = require('../controllers/timetableController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

const timetableValidation = [
  body('batchId').notEmpty().withMessage('Batch ID is required'),
  body('weekStartDate').isISO8601().withMessage('Valid week start date is required'),
  body('schedule').custom((value) => {
    if (Array.isArray(value)) return true;
    if (typeof value === 'string') {
      try {
        JSON.parse(value);
        return true;
      } catch (e) {
        throw new Error('Schedule must be a valid array or JSON string');
      }
    }
    throw new Error('Schedule must be an array or JSON string');
  })
];

router.post('/', authenticate, authorize('admin'), timetableValidation, createTimetable);
router.get('/', authenticate, getAllTimetables);
router.get('/:id', authenticate, getTimetableById);
router.put('/:id', authenticate, authorize('admin'), timetableValidation, updateTimetable);
router.delete('/:id', authenticate, authorize('admin'), deleteTimetable);

module.exports = router;