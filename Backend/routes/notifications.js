const express = require('express');
const { body } = require('express-validator');
const { createNotification, getAllNotifications, getNotificationById, updateNotification, deleteNotification } = require('../controllers/notificationController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

const notificationValidation = [
  body('title').notEmpty().withMessage('Title is required'),
  body('message').notEmpty().withMessage('Message is required'),
  body('forRole').isIn(['admin', 'staff', 'student', 'all']).withMessage('Invalid role')
];

router.post('/', authenticate, authorize('admin', 'staff'), notificationValidation, createNotification);
router.get('/', authenticate, getAllNotifications);
router.get('/:id', authenticate, getNotificationById);
router.put('/:id', authenticate, authorize('admin', 'staff'), updateNotification);
router.delete('/:id', authenticate, authorize('admin'), deleteNotification);

module.exports = router;