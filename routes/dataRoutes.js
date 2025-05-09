// Require data controller
const dataController = require('../controllers/dataController');

const { Router } = require('express');
const router = Router();

// Get route for pending products
router.get('/storeApi/pendingProducts', dataController.getProducts);

// Get route for pending stockings
router.get('/storeApi/pendingStocking', dataController.handleSoftwareStocking);

// Post routes to get sales from branches
router.post('/storeApi/sync-sales-from-branches', dataController.getSales);

module.exports = router;