// Require data controller
const dataController = require('../controllers/dataController');

const { Router } = require('express');
const router = Router();

// Get route for pending stockings
router.get('/storeApi/pendingStocking', dataController.handleSoftwareStocking);

module.exports = router;