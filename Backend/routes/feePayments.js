const express = require('express');
const router = express.Router();
const feePaymentController = require('../controllers/feePaymentController');
const { authenticate } = require('../middleware/auth');

router.post('/', authenticate, feePaymentController.createPayment);
router.get('/', authenticate, feePaymentController.getAllPayments);
router.get('/overview', authenticate, feePaymentController.getFeeOverview);
router.get('/pending-students', authenticate, feePaymentController.getStudentsWithPendingFees);
router.get('/student/:studentId', authenticate, feePaymentController.getStudentFeeSummary);
router.delete('/:id', authenticate, feePaymentController.deletePayment);

module.exports = router;
