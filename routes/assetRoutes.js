const express = require("express");
const router = express.Router();
const assetController = require("../controllers/assetController");

// Render add asset page
router.get("/assets/add", assetController.renderAddAssetPage);

// Handle add asset form submission
router.post("/assets/add", assetController.addAsset);

// Render all assets page
router.get("/assets/all", assetController.renderAllAssetsPage);

// Render update asset page
router.get("/assets/:id/update", assetController.renderUpdateAssetPage);

// Handle update asset form submission
router.post("/assets/:id/update", assetController.updateAsset);

module.exports = router;
