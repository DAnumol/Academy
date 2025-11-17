const express = require('express');
const { body } = require('express-validator');
const { createStaff, getAllStaff, getStaffById, updateStaff, deleteStaff } = require('../controllers/staffController');
const { authenticate, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

const staffValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('phone').isMobilePhone().withMessage('Please provide a valid phone number')
];

router.post('/', authenticate, authorize('admin'), upload.single('profilePic'), staffValidation, createStaff);
router.get('/', authenticate, authorize('admin', 'staff'), getAllStaff);
router.get('/:id', authenticate, authorize('admin', 'staff'), getStaffById);
router.put('/:id', authenticate, authorize('admin'), upload.single('profilePic'), updateStaff);
router.delete('/:id', authenticate, authorize('admin'), deleteStaff);

module.exports = router;