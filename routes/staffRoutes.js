// Require Staff controller
const staffController = require('../controllers/staffController');

// Require JWT middleware
const { verifyToken } = require('../middleware/jwt');

const { Router } = require('express');
const router = Router();

// Add staff route (GET)
router.get('/staff/add', verifyToken, staffController.getAddStaffPage);

// Add staff route (POST)
router.post('/staff/add', verifyToken, staffController.addStaff);

// Get update staff page (GET)
router.get('/staff/:payrollId/update', verifyToken, staffController.getUpdateStaffPage);

// Get all staff route (GET)
router.get('/staff/all', verifyToken, staffController.getAllStaff);

// Update staff route (POST)
router.post('/staff/:payrollId/update', verifyToken, staffController.updateStaff);

module.exports = router;