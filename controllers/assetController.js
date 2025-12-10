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

// Render update asset page
const renderUpdateAssetPage = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await assetModel.getAssetById(id);
        const branches = await branchModel.getAllBranches();

        if (result.length === 0) {
            req.flash("error_msg", "Asset not found");
            return res.redirect("/assets/all");
        }

        res.render("update-asset", { asset: result[0], branches });
    } catch (error) {
        console.error("Error rendering update asset page:", error);
        req.flash("error_msg", "Error fetching asset details");
        res.redirect("/assets/all");
    }
};

// Update existing asset
const updateAsset = async (req, res) => {
    try {
        const { id } = req.params;
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
            status,
            usefulLife,
            salvageValue
        } = req.body;

        const assetData = {
            assetName,
            assetCategory,
            assetDescription,
            purchaseDate,
            purchasePrice: parseFloat(purchasePrice),
            currentValue: parseFloat(currentValue),
            assetCondition,
            location,
            serialNumber,
            warrantyExpiry,
            status,
            usefulLife: parseInt(usefulLife),
            salvageValue: parseFloat(salvageValue)
        };

        await assetModel.updateAsset(id, assetData);
        req.flash("success_msg", "Asset updated successfully");
        res.redirect("/assets/all");
    } catch (error) {
        console.error("Error updating asset:", error);
        req.flash("error_msg", "Error updating asset");
        res.redirect("/assets/all");
    }
};

// Calculate depreciation on the fly
const calculateDepreciation = (asset) => {
    if (!asset.useful_life_years || asset.useful_life_years <= 0) return asset.purchase_price;

    const purchaseDate = new Date(asset.purchase_date);
    const currentDate = new Date();
    const timeDiff = Math.abs(currentDate - purchaseDate);
    const yearsElapsed = timeDiff / (1000 * 3600 * 24 * 365);

    const cost = parseFloat(asset.purchase_price);
    const salvage = parseFloat(asset.salvage_value) || 0;
    const usefulLife = parseFloat(asset.useful_life_years);

    if (yearsElapsed >= usefulLife) return salvage;

    const annualDepreciation = (cost - salvage) / usefulLife;
    const totalDepreciation = annualDepreciation * yearsElapsed;
    const currentValue = cost - totalDepreciation;

    return currentValue > salvage ? currentValue : salvage;
};

// Render all assets page with dynamic depreciation
const renderAllAssetsPage = async (req, res) => {
    try {
        const assets = await assetModel.getAllAssets();

        // Enhance with dynamic current value
        const enhancedAssets = assets.map(asset => {
            return {
                ...asset,
                current_value: calculateDepreciation(asset)
            };
        });

        res.render("all-assets", { assets: enhancedAssets });
    } catch (error) {
        console.error("Error fetching assets:", error);
        req.flash("error_msg", "Failed to load assets");
        res.redirect("/admin/dashboard");
    }
};

module.exports = {
    renderAddAssetPage,
    addAsset,
    renderAllAssetsPage,
    renderUpdateAssetPage,
    updateAsset
};
