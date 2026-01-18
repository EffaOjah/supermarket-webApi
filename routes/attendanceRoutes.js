const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const { verifyToken, requireRole } = require('../middleware/jwt');

// Admin, Warehouse, Operations
router.get('/', verifyToken, requireRole(['admin', 'warehouse', 'operations']), attendanceController.getAttendancePage);
router.post('/clock-in', verifyToken, requireRole(['admin', 'warehouse', 'operations']), attendanceController.clockIn);
router.post('/clock-out', verifyToken, requireRole(['admin', 'warehouse', 'operations']), attendanceController.clockOut);

module.exports = router;
