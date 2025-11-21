const express = require('express');
const { body } = require('express-validator');
const { login, register, getProfile, registerAdmin } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Validation middleware
const loginValidation = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

const registerValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isIn(['admin', 'staff', 'student']).withMessage('Invalid role')
];

const adminRegisterValidation = [
  body('username').notEmpty().withMessage('Username is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('secretKey').notEmpty().withMessage('Admin secret key is required')
];

// Routes
router.post('/login', loginValidation, login);
router.post('/register', registerValidation, register);
router.post('/admin/register', adminRegisterValidation, registerAdmin);
router.get('/profile', authenticate, getProfile);

module.exports = router;