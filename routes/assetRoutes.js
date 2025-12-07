const express = require("express");
const router = express.Router();
const assetController = require("../controllers/assetController");

// Render add asset page
router.get("/assets/add", assetController.renderAddAssetPage);

// Handle add asset form submission
router.post("/assets/add", assetController.addAsset);

// Render all assets page
router.get("/assets/all", assetController.renderAllAssetsPage);

module.exports = router;
