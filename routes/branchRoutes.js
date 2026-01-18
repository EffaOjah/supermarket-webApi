// File: routes/branchRoutes.js

// Require branch controller
const branchController = require("../controllers/branchController");

// Branch Model
const BranchModel = require("../models/branchModel");

// Require JWT middleware
const { verifyToken, requireRole } = require("../middleware/jwt");

/* Custom middleware to update the
lastInspected column for the branches */
const updateLastInspected = async (req, res, next) => {
  const branchId = req.params.branchId;
  console.log("Testing custom middleware: ", branchId);

  if (!branchId) {
    return next();
  }

  try {
    const updateLastInspected = await BranchModel.updateLastInspected(branchId);
    console.log(updateLastInspected);

    return next();
  } catch (error) {
    console.info("Middleware error: ", error);
    return res.render("error-page");
  }
};

const { Router } = require("express");
const router = Router();

// Branch page route (GET) - Admin, PKO, Warehouse, Operations
router.get(
  "/branch/:branchId",
  verifyToken,
  requireRole(['admin', 'pko', 'warehouse', 'operations']),
  updateLastInspected,
  branchController.getBranchPage
);

// Stock branch page - Admin, PKO, Warehouse, Operations
router.get("/stock-branch/:branchId", verifyToken, requireRole(['admin', 'pko', 'warehouse', 'operations']), updateLastInspected, branchController.getStockBranchPage);

// Stock branch wholesale (POST) - Admin, PKO, Warehouse, Operations
router.post('/stock-branch-wholesale/:branchId', verifyToken, requireRole(['admin', 'pko', 'warehouse', 'operations']), branchController.stockBranchWholesale);

// Stock branch retail (POST) - Admin, PKO, Warehouse, Operations
router.post('/stock-branch-retail/:branchId', verifyToken, requireRole(['admin', 'pko', 'warehouse', 'operations']), branchController.stockBranchRetail);

// Get branch products (GET) - Admin, PKO, Warehouse, Operations
router.get(
  "/branch/:branchId/products",
  verifyToken,
  requireRole(['admin', 'pko', 'warehouse', 'operations']),
  updateLastInspected,
  branchController.getBranchProducts
);

// Get branch sales (GET) - Admin, PKO, Warehouse, Operations
router.get(
  "/branch/:branchId/sales",
  verifyToken,
  requireRole(['admin', 'pko', 'warehouse', 'operations']),
  updateLastInspected,
  branchController.getBranchSalesPage
);

router.get(
  "/storeApi/activate-software",
  branchController.handleBranchActivation
);

router.get("/sale-details/:saleId", verifyToken, branchController.getSaleItems);

// Get the low stock count
router.get('/low-stock-count/:branchId', verifyToken, branchController.checkLowStockLevel)

// Get products with low wholesale stock level
router.get('/get-low-wholesale-stock/:branchId', verifyToken, branchController.checkWholesaleStockLevel);

// Get products with low retail stock level
router.get('/get-low-retail-stock/:branchId', verifyToken, branchController.checkRetailStockLevel);

// Get branch notifications page - Admin, PKO, Warehouse, Operations
router.get('/branch/:branchId/notifications', verifyToken, requireRole(['admin', 'pko', 'warehouse', 'operations']), branchController.getBranchNotificationsPage);

// Get stock transfer page - Admin, PKO, Warehouse, Operations
router.get('/branch/:branchId/transfer-stock', verifyToken, requireRole(['admin', 'pko', 'warehouse', 'operations']), branchController.getStockTransferPage);

// Post route to transfer branch stock - Admin, PKO, Warehouse, Operations
router.post('/branch/transfer-stock', verifyToken, requireRole(['admin', 'pko', 'warehouse', 'operations']), branchController.transferBranchStock);

module.exports = router;
