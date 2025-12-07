const assetModel = require("../models/assetModel");
const branchModel = require("../models/branchModel");

// Render add asset page
const renderAddAssetPage = async (req, res) => {
    try {
        // Get all branches for location dropdown
        const branches = await branchModel.getAllBranches();
        res.render("add-asset", { branches });
    } catch (error) {
        console.error("Error rendering add asset page:", error);
        req.flash("error_msg", "Failed to load add asset page");
        res.redirect("/admin/dashboard");
    }
};

// Add new asset
const addAsset = async (req, res) => {
    try {
        const {
            assetName,
            assetCategory,
            assetDescription,
            purchaseDate,
            purchasePrice,
            currentValue,
            assetCondition,
            location,
            serialNumber,
            warrantyExpiry,
            status
        } = req.body;

        // Validation
        if (!assetName || !assetCategory || !purchaseDate || !purchasePrice || !location || !status) {
            req.flash("error_msg", "Please fill in all required fields");
            return res.redirect("/assets/add");
        }

        // Prepare asset data
        const assetData = {
            assetName,
            assetCategory,
            assetDescription: assetDescription || null,
            purchaseDate,
            purchasePrice: parseFloat(purchasePrice),
            currentValue: currentValue ? parseFloat(currentValue) : parseFloat(purchasePrice),
            assetCondition,
            location,
            serialNumber: serialNumber || null,
            warrantyExpiry: warrantyExpiry || null,
            status
        };

        // Insert asset into database
        await assetModel.insertAsset(assetData);

        req.flash("success_msg", "Asset added successfully!");
        res.redirect("/assets/add");
    } catch (error) {
        console.error("Error adding asset:", error);
        req.flash("error_msg", "Failed to add asset. Please try again.");
        res.redirect("/assets/add");
    }
};

// Render all assets page
const renderAllAssetsPage = async (req, res) => {
    try {
        const assets = await assetModel.getAllAssets();
        res.render("all-assets", { assets });
    } catch (error) {
        console.error("Error fetching assets:", error);
        req.flash("error_msg", "Failed to load assets");
        res.redirect("/admin/dashboard");
    }
};

module.exports = {
    renderAddAssetPage,
    addAsset,
    renderAllAssetsPage
};
