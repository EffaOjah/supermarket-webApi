const express = require("express");
const router = express.Router();
const assetController = require("../controllers/assetController");
const { verifyToken, requireRole } = require('../middleware/jwt');

// Render add asset page - Admin, Warehouse, Operations
router.get("/assets/add", verifyToken, requireRole(['admin', 'warehouse', 'operations']), assetController.renderAddAssetPage);

// Handle add asset form submission - Admin, Warehouse, Operations
router.post("/assets/add", verifyToken, requireRole(['admin', 'warehouse', 'operations']), assetController.addAsset);

// Render all assets page - Admin, Warehouse, Operations
router.get("/assets/all", verifyToken, requireRole(['admin', 'warehouse', 'operations']), assetController.renderAllAssetsPage);

// Render update asset page - Admin, Warehouse, Operations
router.get("/assets/:id/update", verifyToken, requireRole(['admin', 'warehouse', 'operations']), assetController.renderUpdateAssetPage);

// Handle update asset form submission - Admin, Warehouse, Operations
router.post("/assets/:id/update", verifyToken, requireRole(['admin', 'warehouse', 'operations']), assetController.updateAsset);

module.exports = router;
