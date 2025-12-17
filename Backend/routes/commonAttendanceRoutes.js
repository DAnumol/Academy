const express = require('express');
const router = express.Router();
const commonAttendanceController = require('../controllers/commonAttendanceController');

router.get('/', commonAttendanceController.getAllCommonAttendance);
router.get('/export/pdf', commonAttendanceController.exportCommonAttendancePDF);
router.get('/export/excel', commonAttendanceController.exportCommonAttendanceExcel);
router.get('/:id', commonAttendanceController.getCommonAttendanceById);
router.post('/', commonAttendanceController.createCommonAttendance);
router.put('/:id', commonAttendanceController.updateCommonAttendance);
router.delete('/:id', commonAttendanceController.deleteCommonAttendance);

module.exports = router;
