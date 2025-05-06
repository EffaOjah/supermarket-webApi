// File: controllers/branchController.js

// Branch Model
const BranchModel = require('../models/branchModel');

// Get branch page
const getBranchPage = async (req, res) => {
    try {
        // Get branch by ID
        const branchId = req.params.branchId;

        const branch = await BranchModel.getBranchById(branchId);
        console.log('Branch:', branch);

        const products = await BranchModel.getBranchProducts(branchId);
        console.log(products);

        res.render('branch-overview', { branch, products });
    } catch (error) {
        console.log('An error occurred: ', error);
        return res.render('error-page');
    }
};

// Get Stock branch page
const getStockBranchPage = async (req, res) => {
    try {
        // Get branch by ID
        const branchId = req.params.branchId;

        const branch = await BranchModel.getBranchById(branchId);
        console.log('Branch:', branch);

        const products = await BranchModel.getProductsOnly();
        console.log('Products:', products);

        const branchProducts = await BranchModel.getBranchProducts(branchId);
        console.log(branchProducts);

        res.render('stock-branch', { branch, products, branchProducts });
    } catch (error) {
        console.log('An error occurred: ', error);
        return res.render('error-page');
    }
};

// Stock branch (POST)
const stockBranch = async (req, res) => {
    const { productId, quantity } = req.body;
    const branchId = req.params.branchId;

    try {
        // Get the product details from the database using the productId
        const product = await BranchModel.getProductById(productId);
        console.log(product);

        if (!product) {
            console.log('Product not found');
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check if the product is already in stock for the branch
        const existingStock = await BranchModel.getExistingBranchProduct(branchId, productId);

        if (existingStock.length > 0) {
            // Update the existing stock quantity
            const updatedStock = await BranchModel.updateBranchStock(branchId, productId, quantity);
            console.log(updatedStock);
        } else {
            // Insert new stock for the branch
            const newStock = await BranchModel.insertBranchStock(branchId, productId, quantity);
            console.log(newStock);
        }

        return res.status(200).json({ message: 'Stock updated successfully' });
    } catch (error) {
        console.log('Error fetching product:', error);
        return res.status(500).json({ message: 'Internal Server Error', error });
    }
};

// Get branch products
const getBranchProducts = async (req, res) => {
    const branchId = req.params.branchId;

    try {
        const branch = await BranchModel.getBranchById(branchId);
        console.log('Branch:', branch);

        const products = await BranchModel.getBranchProducts(branchId);
        console.log(products);

        return res.render('branch-products', { branch, products });
    } catch (error) {
        console.log('Error fetching branch products:', error);
        return res.status(500).json({ message: 'Internal Server Error', error });
    }
};

module.exports = { getBranchPage, getStockBranchPage, stockBranch, getBranchProducts };