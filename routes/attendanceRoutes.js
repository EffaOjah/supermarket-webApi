const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');

router.get('/', attendanceController.getAttendancePage);
router.post('/clock-in', attendanceController.clockIn);
router.post('/clock-out', attendanceController.clockOut);

module.exports = router;
