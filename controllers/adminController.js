// File: controllers/adminController.js

// Admin Model
const AdminModel = require('../models/adminModel');


// Get dashboard page
const getDashboard = async (req, res) => {
    try {
        // Get all branches
        const branches = await AdminModel.getBranches();
        console.log('Branches:', branches);

        const products = await AdminModel.getProducts();
        console.log(products);

        res.render('dashboard', { branches, products });
    } catch (error) {
        console.log('An error occurred: ', error);
        return res.render('error-page');
    }

};

// Get product upload page
const getProductUpload = async (req, res) => {
    try {
        // Get all suppliers
        const suppliers = await AdminModel.getSuppliers();
        console.log('Suppliers:', suppliers);

        const products = await AdminModel.getProducts();
        console.log(products);

        res.render('upload-products', { suppliers, products });
    } catch (error) {
        console.log('An error occurred: ', error);
        return res.render('error-page');
    }
};

// Upload product
const uploadProducts = async (req, res) => {
    // console.log('File details:', req.file);
    console.log('Form fields:', req.body);

    const { productName, wholesalePrice, retailPrice, category, supplierId } = req.body;

    try {
        // Insert into the database
        const addProduct = await AdminModel.uploadProduct(productName, Number(wholesalePrice), Number(retailPrice), supplierId, category);
        console.log(addProduct);

        return res.redirect('/admin/product-upload');
    } catch (error) {
        console.log('Error uploading product:', error);
        return res.redirect('/admin/product-upload');
    }
};

// Get all products
const getAllProducts = async (req, res) => {
    try {
        const products = await AdminModel.getProducts();
        console.log(products);

        return res.render('all-products', { products });
    } catch (error) {
        console.log('Error fetching products:', error);
        return res.status(500).json({ message: 'Internal Server Error', error });
    }
};

// Get store branch using branch id
const getStoreBranchById = async (req, res) => {
    const branchId = req.params.branchId;

    try {
        const branch = await AdminModel.getStoreBranchById(branchId);
        console.log(branch);

        return res.status(200).json({ branch });
    } catch (error) {
        console.log('Error fetching branch:', error);
        return res.status(500).json({ message: 'Internal Server Error', error });
    }
};

// Get branch products
const getBranchProducts = async (req, res) => {
    const branchId = req.params.branchId;

    try {
        const products = await AdminModel.getBranchProducts(branchId);
        console.log(products);

        return res.status(200).json({ products });
    } catch (error) {
        console.log('Error fetching branch products:', error);
        return res.status(500).json({ message: 'Internal Server Error', error });
    }
};

// Get all branch sales
const getBranchSales = async (req, res) => {
    const branchId = req.params.branchId;

    try {
        const sales = await AdminModel.getBranchSales(branchId);
        console.log(sales);

        return res.status(200).json({ sales });
    } catch (error) {
        console.log('Error fetching branch sales:', error);
        return res.status(500).json({ message: 'Internal Server Error', error });
    }
};


module.exports = { getDashboard, getProductUpload, uploadProducts, getAllProducts, getStoreBranchById, getBranchProducts, getBranchSales };