// Require data controller
const dataController = require('../controllers/dataController');

const { Router } = require('express');
const router = Router();

// Get route for pending stockings
router.get('/storeApi/pendingStocking', dataController.handleSoftwareStocking);

// Post routes to get sales from branches
router.post('/storeApi/sync-sales-from-branches', dataController.getSales);

// Get route to get all products
router.get('/storeApi/get-all-products', dataController.getProducts);

// Get route to get all products
router.get('/storeApi/get-products', dataController.getUpdatedProducts);

module.exports = router;