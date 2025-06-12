// Require branch controller
const branchController = require('../controllers/branchController');

// Require JWT middleware
const { verifyToken } = require('../middleware/jwt');

const { Router } = require('express');
const router = Router();

// Branch page route (GET)
router.get('/branch/:branchId', verifyToken, branchController.getBranchPage);

// Stock branch page
router.route('/stock-branch/:branchId')
.get(verifyToken, branchController.getStockBranchPage)
.post(verifyToken, branchController.stockBranch);

// Get branch products (GET)
router.get('/branch/:branchId/products', verifyToken, branchController.getBranchProducts);

// Get branch sales (GET)
router.get('/branch/:branchId/sales', verifyToken, branchController.getBranchSalesPage);

router.get('/storeApi/activate-software', branchController.handleBranchActivation);

router.get('/sale-details/:saleId', verifyToken, branchController.getSaleItems);

module.exports = router;