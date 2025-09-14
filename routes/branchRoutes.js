// File: routes/branchRoutes.js

// Require branch controller
const branchController = require("../controllers/branchController");

// Branch Model
const BranchModel = require("../models/branchModel");

// Require JWT middleware
const { verifyToken } = require("../middleware/jwt");

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

// Branch page route (GET)
router.get(
  "/branch/:branchId",
  verifyToken,
  updateLastInspected,
  branchController.getBranchPage
);

// Stock branch page
router.get("/stock-branch/:branchId", verifyToken, updateLastInspected, branchController.getStockBranchPage);

// Stock branch wholesale (POST)
router.post('/stock-branch-wholesale/:branchId', verifyToken, branchController.stockBranchWholesale);

// Stock branch retail (POST)
router.post('/stock-branch-retail/:branchId', verifyToken, branchController.stockBranchRetail);

// Get branch products (GET)
router.get(
  "/branch/:branchId/products",
  verifyToken,
  updateLastInspected,
  branchController.getBranchProducts
);

// Get branch sales (GET)
router.get(
  "/branch/:branchId/sales",
  verifyToken,
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

// Get branch notifications page
router.get('/branch/:branchId/notifications', verifyToken, branchController.getBranchNotificationsPage);

module.exports = router;
