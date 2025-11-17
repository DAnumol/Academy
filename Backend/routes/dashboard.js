const express = require('express');
const { getAdminDashboard, getStaffDashboard, getStudentDashboard } = require('../controllers/dashboardController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/admin', authenticate, authorize('admin'), getAdminDashboard);
router.get('/staff', authenticate, authorize('staff'), getStaffDashboard);
router.get('/student', authenticate, authorize('student'), getStudentDashboard);

module.exports = router;