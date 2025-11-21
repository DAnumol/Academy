const express = require('express');
const { body } = require('express-validator');
const { createStaff, getAllStaff, getStaffById, updateStaff, deleteStaff } = require('../controllers/staffController');
const { authenticate, authorize } = require('../middleware/auth');
const { checkPermission, PERMISSIONS } = require('../middleware/permissions');
const upload = require('../middleware/upload');

const router = express.Router();

const staffValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('phone').isMobilePhone().withMessage('Please provide a valid phone number')
];

router.post('/', authenticate, checkPermission(PERMISSIONS.CREATE_STAFF), upload.single('profilePic'), staffValidation, createStaff);
router.get('/', authenticate, checkPermission(PERMISSIONS.VIEW_STAFF), getAllStaff);
router.get('/:id', authenticate, checkPermission(PERMISSIONS.VIEW_STAFF), getStaffById);
router.put('/:id', authenticate, checkPermission(PERMISSIONS.EDIT_STAFF), upload.single('profilePic'), updateStaff);
router.delete('/:id', authenticate, checkPermission(PERMISSIONS.DELETE_STAFF), deleteStaff);

module.exports = router;