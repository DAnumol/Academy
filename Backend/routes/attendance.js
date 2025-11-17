const express = require('express');
const { body } = require('express-validator');
const { markAttendance, getAttendance, getAttendanceById, updateAttendance, deleteAttendance } = require('../controllers/attendanceController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

const attendanceValidation = [
  body('batchId').notEmpty().withMessage('Batch ID is required'),
  body('subjectId').notEmpty().withMessage('Subject ID is required'),
  body('date').isISO8601().withMessage('Valid date is required'),
  body('records').isArray().withMessage('Records must be an array')
];

router.post('/', authenticate, authorize('staff'), attendanceValidation, markAttendance);
router.get('/', authenticate, getAttendance);
router.get('/:id', authenticate, getAttendanceById);
router.put('/:id', authenticate, authorize('staff'), updateAttendance);
router.delete('/:id', authenticate, authorize('admin', 'staff'), deleteAttendance);

module.exports = router;