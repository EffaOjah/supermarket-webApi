const express = require('express');
const router = express.Router();
const pkoController = require('../controllers/pkoController');
const { verifyToken, requireRole } = require('../middleware/jwt');

// Dashboard
router.get('/dashboard', verifyToken, requireRole(['pko']), pkoController.getPKODashboard);

module.exports = router;
