const express = require('express');
const router = express.Router();
const salesRepController = require('../controllers/salesRepController');

// Login
router.get('/login', salesRepController.viewLogin);
router.post('/login', salesRepController.login);
router.get('/logout', salesRepController.logout);

// Dashboard
router.get('/dashboard', salesRepController.getDashboard);

// Requests
router.get('/request', salesRepController.viewRequestPage);
router.post('/request', salesRepController.makeRequest);
router.get('/requests/:id', salesRepController.viewRequestDetails);


module.exports = router;
