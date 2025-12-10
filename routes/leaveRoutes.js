const express = require('express');
const router = express.Router();
const leaveController = require('../controllers/leaveController');

// Pages
router.get('/apply', leaveController.getApplyLeavePage);
router.get('/manage', leaveController.getManageLeavesPage);

// Actions
router.post('/apply', leaveController.submitLeaveRequest);
router.post('/update-status/:id', leaveController.updateLeaveStatus);

module.exports = router;