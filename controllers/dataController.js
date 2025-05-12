// File: controllers/dataController.js

// Data Model
const DataModel = require('../models/dataModel');

// Logic to get products
const getProducts = async (req, res) => {
    try {
        const pendingProducts = await DataModel.getProducts('pending');
        console.log(pendingProducts);

        return res.status(200).json({ pendingProducts });
    } catch (error) {
        console.log('Error getting products: ', error);
        return res.status(500).json({ message: 'Internal Server Error', error });
    }
}

// Logic to update the product that were delivered

// Logic to get pending products
const handleSoftwareStocking = async (req, res) => {
    try {
        const branchId = req.query.branchId;

        // Check if branch exists
        const branch = await DataModel.getBranchById(branchId);
        console.log(branch);

        if (branch.length < 1) {
            console.log('Branch does not exist');
            return res.status(400).json({ message: 'Branch does not exist' });
        }

        // First check for any stocking that hasn't been delivered
        const pendingStock = await DataModel.checkForStock(branchId, 'pending');
        console.log(pendingStock);

        if (pendingStock.length < 1) {
            console.log('There are no pending stocks');
            return res.status(200).json({ message: 'There are no pending stocks' });
        }

        // Store the product IDs of all the pending stock
        const productIDs = pendingStock.map(product => product.product_id)
        console.log(productIDs);

        const placeholders = productIDs.map(() => '?').join(',');

        // If there's a pending stock, returning in the response object
        res.status(200).json({ message: 'Pending stock available', pendingStock });

        // Update the status column on the branch stock table
        const updateStockStatus = await DataModel.updateStockStatus(placeholders, productIDs, 'delivered');
        console.log(updateStockStatus);
    } catch (error) {
        console.log('Error performing stocking:', error);
        return res.status(500).json({ message: 'Internal Server Error', error });
    }
}

// Logic to get sales from the branches
const getSales = async (req, res) => {
    try {
        const branchId = req.query.branchId;

        // First check if the branch exists
        const branch = await DataModel.getBranchById(branchId);
        console.log(branch);

        if (branch.length < 1) {
            console.log('Branch does not exist');
            return res.status(400).json({ message: 'Branch does not exist' });
        }

        let data = req.body;

        // Insert into the sale table
        // const insertSale = await DataModel.insertSale(branchId, data.sales);
        // console.log(insertSale);

        // // Insert into the sale_items table
        // const insertSaleItems = await DataModel.insertSaleItems(data.saleItems);
        // console.log(insertSaleItems);

        // Run the insertion process
        const handleSalesSyncing = await DataModel.handleSalesSyncing(branchId, data.sales, data.saleItems);
        console.log(handleSalesSyncing);
        


        console.log(req.body);
        res.status(200).json({ body: req.body });

    } catch (error) {
        console.log('Error getting  sales: ', error);
        return res.status(500).json({ message: 'Internal Server Error', error });
    }
}

module.exports = { getProducts, handleSoftwareStocking, getSales };