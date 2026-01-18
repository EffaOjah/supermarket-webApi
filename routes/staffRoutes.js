// Require Staff controller
const staffController = require('../controllers/staffController');

// Require JWT middleware
const { verifyToken, requireRole } = require('../middleware/jwt');

const { Router } = require('express');
const router = Router();

// Add staff route (GET) - Admin, Warehouse, Operations
router.get('/staff/add', verifyToken, requireRole(['admin', 'warehouse', 'operations']), staffController.getAddStaffPage);

// Add staff route (POST) - Admin, Warehouse, Operations
router.post('/staff/add', verifyToken, requireRole(['admin', 'warehouse', 'operations']), staffController.addStaff);

// Get update staff page (GET) - Admin, Warehouse, Operations
router.get('/staff/:payrollId/update', verifyToken, requireRole(['admin', 'warehouse', 'operations']), staffController.getUpdateStaffPage);

// Get all staff route (GET) - Admin, Warehouse, Operations
router.get('/staff/all', verifyToken, requireRole(['admin', 'warehouse', 'operations']), staffController.getAllStaff);

// Update staff route (POST) - Admin, Warehouse, Operations
router.post('/staff/:payrollId/update', verifyToken, requireRole(['admin', 'warehouse', 'operations']), staffController.updateStaff);

module.exports = router;