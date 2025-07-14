// File: controllers/branchController.js

// Branch Model
const BranchModel = require("../models/branchModel");

const getBranchPage = async (req, res) => {
  try {
    const branchId = req.params.branchId;

    // Get branch
    const branch = await BranchModel.getBranchById(branchId);

    if (branch.length < 1) {
      console.warn("Branch not found:", branchId);
      return res.render("error-page");
    }

    const products = await BranchModel.getBranchProducts(branchId);

    // Render page
    res.render("branch-overview", { branch, products });
  } catch (error) {
    console.error("An error occurred:", error);
    return res.render("error-page");
  }
};

// Get stock branch page
const getStockBranchPage = async (req, res) => {
  try {
    // Get branch by ID
    const branchId = req.params.branchId;

    const branch = await BranchModel.getBranchById(branchId);
    console.log("Branch:", branch);

    const products = await BranchModel.getProductsOnly();

    const branchProducts = await BranchModel.getBranchProducts(branchId);

    res.render("stock-branch", { branch, products, branchProducts });
  } catch (error) {
    console.log("An error occurred: ", error);
    return res.render("error-page");
  }
};

// Get branch sales page
const getBranchSalesPage = async (req, res) => {
  try {
    // Get branch by ID
    const branchId = req.params.branchId;

    const branch = await BranchModel.getBranchById(branchId);
    console.log("Branch:", branch);

    const branchProducts = await BranchModel.getBranchProducts(branchId);

    const branchSales = await BranchModel.getBranchSales(branchId);

    res.render("sales", { branch, branchProducts, branchSales });
  } catch (error) {
    console.log("An error occurred: ", error);
    return res.render("error-page");
  }
};

// Stock branch - wholesale (POST)
const stockBranchWholesale = async (req, res) => {
  const { productId, wholesaleQuantity } = req.body;
  const branchId = req.params.branchId;

  // Check if all details were provided
  if (!productId || !wholesaleQuantity) {
    console.log('Please provide all details');
    req.flash('error_msg', 'Please provide all details');
    return res.redirect(`/stock-branch/${branchId}`);
  }

  try {
    // Check if branch exists
    const branch = await BranchModel.getBranchById(branchId);
    if (branch.length < 1) {
      console.log('Branch does not exist');
      req.flash('error_msg', 'Branch not found');
      return res.redirect(`/stock-branch/${branchId}`);
    }

    // Get the product details from the database using the productId
    const product = await BranchModel.getProductById(productId);
    console.log(product);

    if (!product) {
      console.log("Product not found");
      req.flash('error_msg', 'Product not found');
      return res.redirect(`/stock-branch/${branchId}`);
    }

    // Check if the wholesale price has been set
    if (!product[0].wholesale_cost_price || !product[0].wholesale_selling_price) {
      console.log('Wholesale price has not been set for this product');
      req.flash('error_msg', 'Wholesale price has not been set for this product');

      // Set cookie to hold productID
      res.cookie('productId', product[0].product_id, {
        maxAge: 1800000 // 30 minutes in milliseconds
      });

      return res.redirect(`/stock-branch/${branchId}`);
    }

    // Check if the product is already in stock for the branch
    const existingStock = await BranchModel.getExistingBranchProduct(
      branchId,
      productId
    );

    if (existingStock.length > 0) {
      // Update the existing stock quantity
      const updatedStock = await BranchModel.updateBranchStockWholesale(
        branchId,
        productId,
        wholesaleQuantity,
      );
      console.log(updatedStock);
    } else {
      // Insert new stock for the branch
      const newStock = await BranchModel.insertBranchStockWholesale(
        branchId,
        productId,
        wholesaleQuantity,
      );
      console.log(newStock);
    }

    req.flash('success_msg', 'Stock update successful');
    return res.redirect(`/stock-branch/${branchId}`);
  } catch (error) {
    console.log("Stock update failed: ", error);

    req.flash('error_msg', 'Stock update failed');
    return res.redirect(`/stock-branch/${branchId}`);
  }
};

// Stock branch - retail (POST)
const stockBranchRetail = async (req, res) => {
  const { productId, retailQuantity } = req.body;
  const branchId = req.params.branchId;

  // Check if all details were provided
  if (!productId || !retailQuantity) {
    console.log('Please provide all details');
    req.flash('error_msg', 'Please provide all details');
    return res.redirect(`/stock-branch/${branchId}`);
  }

  try {
    // Check if branch exists
    const branch = await BranchModel.getBranchById(branchId);
    if (branch.length < 1) {
      console.log('Branch does not exist');
      req.flash('error_msg', 'Branch not found');
      return res.redirect(`/stock-branch/${branchId}`);
    }

    // Get the product details from the database using the productId
    const product = await BranchModel.getProductById(productId);
    console.log(product);

    if (!product) {
      console.log("Product not found");
      req.flash('error_msg', 'Product not found');
      return res.redirect(`/stock-branch/${branchId}`);
    }

    // Check if the retail price has been set
    if (!product[0].retail_cost_price || !product[0].retail_selling_price) {
      console.log('Retail price has not been set for this product');
      req.flash('error_msg', 'Retail price has not been set for this product');

      // Set cookie to hold productID
      res.cookie('productId', product[0].product_id, {
        maxAge: 1800000 // 30 minutes in milliseconds
      });

      return res.redirect(`/stock-branch/${branchId}`);
    }

    // Check if the product is already in stock for the branch
    const existingStock = await BranchModel.getExistingBranchProduct(
      branchId,
      productId
    );

    if (existingStock.length > 0) {
      // Update the existing stock quantity
      const updatedStock = await BranchModel.updateBranchStockRetail(
        branchId,
        productId,
        retailQuantity,
      );
      console.log(updatedStock);
    } else {
      // Insert new stock for the branch
      const newStock = await BranchModel.insertBranchStockRetail(
        branchId,
        productId,
        retailQuantity,
      );
      console.log(newStock);
    }

    req.flash('success_msg', 'Stock update successful');
    return res.redirect(`/stock-branch/${branchId}`);
  } catch (error) {
    console.log("Stock update failed: ", error);

    req.flash('error_msg', 'Stock update failed');
    return res.redirect(`/stock-branch/${branchId}`);
  }
};

// Get branch products
const getBranchProducts = async (req, res) => {
  const branchId = req.params.branchId;

  try {
    const branch = await BranchModel.getBranchById(branchId);
    console.log("Branch:", branch);

    const products = await BranchModel.getBranchProducts(branchId);
    console.log(products);

    return res.render("branch-products", { branch, products });
  } catch (error) {
    console.log("Error fetching branch products:", error);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

const handleBranchActivation = async (req, res) => {
  const activationKey = req.query.activation_key;

  try {
    const checkForBranch = await BranchModel.getBranchById(activationKey);

    if (checkForBranch.length < 1) {
      console.log("Invalid activation key");
      return res.status(200).json({ error: "Invalid activation key" });
    }

    res.status(200).json({ success: "Correct Activation key", checkForBranch });
  } catch (error) {
    console.log("Error activating branch:", error);
    return res.status(500).json({ message: "Internal Server Error: ", error });
  }
};

const getSaleItems = async (req, res) => {
  const saleId = req.params.saleId;

  try {
    const getBranchSaleDetails = await BranchModel.getBranchSaleDetails(saleId);
    console.log("Sale Details: ", getBranchSaleDetails);

    return res.status(200).json({ saleDetails: getBranchSaleDetails });
  } catch (error) {
    console.log("Error getting branch sale details:", error);
    return res.status(500).json({ message: "Internal Server Error: ", error });
  }
};

module.exports = {
  getBranchPage,
  getStockBranchPage,
  getBranchSalesPage,
  stockBranchWholesale,
  stockBranchRetail,
  getBranchProducts,
  handleBranchActivation,
  getSaleItems,
};
