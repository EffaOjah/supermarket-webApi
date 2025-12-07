const db = require("../config/dbConfig");

// Insert new asset
const insertAsset = async (assetData) => {
    return new Promise((resolve, reject) => {
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
        } = assetData;

        db.query(
            `INSERT INTO assets (
        asset_name, 
        asset_category, 
        asset_description, 
        purchase_date, 
        purchase_price, 
        current_value, 
        asset_condition, 
        location, 
        serial_number, 
        warranty_expiry, 
        status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
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
            ],
            (err, result) => {
                if (err) {
                    reject(err);
                }
                resolve(result);
            }
        );
    });
};

// Get all assets
const getAllAssets = async () => {
    return new Promise((resolve, reject) => {
        db.query(
            "SELECT * FROM assets ORDER BY created_at DESC",
            (err, result) => {
                if (err) {
                    reject(err);
                }
                resolve(result);
            }
        );
    });
};

// Get asset by ID
const getAssetById = async (assetId) => {
    return new Promise((resolve, reject) => {
        db.query(
            "SELECT * FROM assets WHERE asset_id = ?",
            [assetId],
            (err, result) => {
                if (err) {
                    reject(err);
                }
                resolve(result);
            }
        );
    });
};

// Update asset
const updateAsset = async (assetId, assetData) => {
    return new Promise((resolve, reject) => {
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
        } = assetData;

        db.query(
            `UPDATE assets SET 
        asset_name = ?, 
        asset_category = ?, 
        asset_description = ?, 
        purchase_date = ?, 
        purchase_price = ?, 
        current_value = ?, 
        asset_condition = ?, 
        location = ?, 
        serial_number = ?, 
        warranty_expiry = ?, 
        status = ?
      WHERE asset_id = ?`,
            [
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
                assetId
            ],
            (err, result) => {
                if (err) {
                    reject(err);
                }
                resolve(result);
            }
        );
    });
};

// Delete asset
const deleteAsset = async (assetId) => {
    return new Promise((resolve, reject) => {
        db.query(
            "DELETE FROM assets WHERE asset_id = ?",
            [assetId],
            (err, result) => {
                if (err) {
                    reject(err);
                }
                resolve(result);
            }
        );
    });
};

module.exports = {
    insertAsset,
    getAllAssets,
    getAssetById,
    updateAsset,
    deleteAsset
};
