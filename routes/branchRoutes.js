// Require Auth route
const branchController = require('../controllers/branchController');

const { Router } = require('express');
const router = Router();

// Branch page route (GET)
router.get('/branch/:branchId', branchController.getBranchPage);

// Stock branch page
router.route('/stock-branch/:branchId')
.get(branchController.getStockBranchPage)
.post(branchController.stockBranch);

// Get branch products (GET)
router.get('/branch/:branchId/products', branchController.getBranchProducts);

module.exports = router;