// Require Auth route
const authController = require('../controllers/authController');

const { Router } = require('express');
const router = Router();

// Sigin in route (GET)
router.get('/admin/signin', authController.signinGet);

// Register route (POST)
// router.post('/auth/register', authController.register);

// Login route (POST)
router.post('/auth/login', authController.login);

// Logout route (GET)
router.get('/logout', authController.logout);

module.exports = router;