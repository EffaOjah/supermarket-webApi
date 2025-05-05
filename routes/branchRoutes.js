// Require Auth route
const branchController = require('../controllers/branchController');

const { Router } = require('express');
const router = Router();

// Branch page route (GET)
router.get('/branch/:id', branchController.getBranchPage);

// Stock branch page
router.route('/stock-branch/:id')
.get(branchController.getStockBranchPage)
.post(branchController.stockBranch);

module.exports = router;