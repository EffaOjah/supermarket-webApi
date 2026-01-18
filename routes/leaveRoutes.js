const express = require('express');
const router = express.Router();
const leaveController = require('../controllers/leaveController');
const { verifyToken, requireRole } = require('../middleware/jwt');

// Pages - Admin, Warehouse, Operations
router.get('/apply', verifyToken, requireRole(['admin', 'warehouse', 'operations']), leaveController.getApplyLeavePage);
router.get('/manage', verifyToken, requireRole(['admin', 'warehouse', 'operations']), leaveController.getManageLeavesPage);

// Actions - Admin, Warehouse, Operations
router.post('/apply', verifyToken, requireRole(['admin', 'warehouse', 'operations']), leaveController.submitLeaveRequest);
router.post('/update-status/:id', verifyToken, requireRole(['admin', 'warehouse', 'operations']), leaveController.updateLeaveStatus);

module.exports = router;