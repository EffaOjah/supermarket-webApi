// File: controllers/branchController.js

const db = require("../config/dbConfig");

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

    // Get branch products
    const products = await BranchModel.getBranchProducts(branchId);
    console.log("Branch Products:", products);

    // Get branch overview
    const overview = await BranchModel.getBranchOverview(branchId);
    console.log("Branch Overview:", overview);

    // Render page
    res.render("branch-overview", { branch, products, overview, user: req.user });
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

    res.render("stock-branch", { branch, products, branchProducts, user: req.user });
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

    res.render("sales", { branch, branchProducts, branchSales, user: req.user });
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

  // Check if the quantity is less than 1
  if (wholesaleQuantity < 1) {
    console.log('Quantity is less than 1');
    req.flash('error_msg', 'Quantity is less than 1');
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

    return res.render("branch-products", { branch, products, user: req.user });
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

// Check low stock level count
const checkLowStockLevel = async (req, res) => {
  const branchId = req.params.branchId;

  try {
    // Check if branch exists
    const branch = await BranchModel.getBranchById(branchId);
    console.log("Branch: ", branch);

    if (branch.length < 1) {
      console.log('Invalid branch ID');
      return res.status(404).json({ error: 'Invalid branch ID' });
    }

    const getProductsCount = await BranchModel.checkLowProducts(branchId);
    console.log("Products with low stock level: ", getProductsCount);

    return res.status(200).json({ products: getProductsCount });
  } catch (error) {
    console.log("Error getting low stock products count: ", error);
    return res.status(500).json({ message: "Internal Server Error: ", error });
  }
};

// Check wholesale stock level of products
const checkWholesaleStockLevel = async (req, res) => {
  const branchId = req.params.branchId;

  try {
    // Check if branch exists
    const branch = await BranchModel.getBranchById(branchId);
    console.log("Branch: ", branch);

    if (branch.length < 1) {
      console.log('Invalid branch ID');
      return res.status(404).json({ error: 'Invalid branch ID' });
    }

    const getProducts = await BranchModel.checkWholesaleStockLevel(branchId);
    console.log("Products with low stock level: ", getProducts);

    return res.status(200).json({ length: getProducts.length, products: getProducts });
  } catch (error) {
    console.log("Error getting low stock products: ", error);
    return res.status(500).json({ message: "Internal Server Error: ", error });
  }
};

// Check retail stock level of products
const checkRetailStockLevel = async (req, res) => {
  const branchId = req.params.branchId;

  try {
    // Check if branch exists
    const branch = await BranchModel.getBranchById(branchId);
    console.log("Branch: ", branch);

    if (branch.length < 1) {
      console.log('Invalid branch ID');
      return res.status(404).json({ error: 'Invalid branch ID' });
    }

    const getProducts = await BranchModel.checkRetailStockLevel(branchId);
    console.log("Products with low stock level: ", getProducts);

    return res.status(200).json({ length: getProducts.length, products: getProducts });
  } catch (error) {
    console.log("Error getting low stock products: ", error);
    return res.status(500).json({ message: "Internal Server Error: ", error });
  }
};

// Get branch notifications page
const getBranchNotificationsPage = async (req, res) => {
  try {
    // Get branch by ID
    const branchId = req.params.branchId;
    const branch = await BranchModel.getBranchById(branchId);
    console.log("Branch:", branch);

    // Get the products
    const products = await BranchModel.getBranchProducts(branchId);

    // Get the low stock wholesale products
    const lowStockWholesaleProducts = await BranchModel.checkWholesaleStockLevel(branchId);
    console.log("Products with low wholsale stock level: ", lowStockWholesaleProducts);

    // Get the low stock retail products
    const lowStockRetailProducts = await BranchModel.checkRetailStockLevel(branchId);
    console.log("Products with low retail stock level: ", lowStockRetailProducts);

    // Get the stock transfer history
    const stockTransferHistory = await BranchModel.getStockTransferHistory(branchId);

    // Get the stock received history
    const stockReceivedHistory = await BranchModel.getStockReceivedHistory(branchId);

    res.render("notifications", { branch, products, lowStockWholesaleProducts, lowStockRetailProducts, stockTransferHistory, stockReceivedHistory, user: req.user });
  } catch (error) {
    console.log("An error occurred: ", error);
    return res.render("error-page");
  }
};

// Get transfer stock page
const getStockTransferPage = async (req, res) => {
  try {
    // Get branch by ID
    const branchId = req.params.branchId;
    const branch = await BranchModel.getBranchById(branchId);
    console.log("Branch:", branch);

    // Get all branches
    const allBranches = await BranchModel.getAllBranches();

    // Get the products
    const products = await BranchModel.getBranchProducts(branchId);

    res.render("stock-transfer", { branch, allBranches, products, user: req.user });
  } catch (error) {
    console.log("An error occurred: ", error);
    return res.render("error-page");
  }
};

// Transfer Branch Stock
const transferBranchStock = async (req, res) => {
  try {
    const { branchId, productId, transferQuantity, type, targetBranchId } = req.body;
    const convertedTransferQuantity = Math.floor(transferQuantity);

    // Make sure all details were provided
    if (!branchId || !productId || !transferQuantity || !type || !targetBranchId) {
      console.log('Please provide all details');
      req.flash('error_msg', 'Please provide all details!')
      return res.redirect(`/branch/${branchId}/transfer-stock`);
    }

    // Check if branch exists
    const branch = await BranchModel.getBranchById(branchId);
    if (branch.length < 1) {
      console.log('Invalid branch ID');
      req.flash('error_msg', 'Branch not found!')
      return res.redirect(`/branch/${branchId}/transfer-stock`);
      // return res.status(404).json({ error: 'Branch not found!' });
    }

    // Get product details
    const productDetails = await BranchModel.getProductByIdAndType(productId, type, branchId);
    if (!productDetails) {
      console.log('Product not found');
      req.flash('error_msg', 'Product not found!');
      return res.redirect(`/branch/${branchId}/transfer-stock`);
      // return res.status(404).json({ error: 'Product not found!' });
    }

    // Now check if the product's quantity is sufficient
    if (productDetails.product_quantity < 1) {
      console.log('Insufficient product');
      req.flash('error_msg', 'Insufficient stock quantity!');
      return res.redirect(`/branch/${branchId}/transfer-stock`);
      // return res.status(422).json({ error: 'Insufficient stock quantity' });
    }

    if (convertedTransferQuantity > productDetails.product_quantity) {
      console.log('Cannot transfer more than the available quantity');
      req.flash('error_msg', 'Cannot transfer more than the available quantity!');
      return res.redirect(`/branch/${branchId}/transfer-stock`);
      // return res.status(422).json({ error: 'Cannot transfer more than the available quantity!' });
    }

    if (branchId == targetBranchId) {
      console.log('Branch can not transfer to itself');
      req.flash('error_msg', 'Branch can not transfer to itself!');
      return res.redirect(`/branch/${branchId}/transfer-stock`);
      // return res.status(400).json({ error: 'Branch can not transfer to itself!' });
    }

    // Validate target branch
    const targetBranch = await BranchModel.getBranchById(targetBranchId);
    if (targetBranch.length < 1) {
      console.log('Invalid target branch ID');
      req.flash('error_msg', 'Target Branch not found!');
      return res.redirect(`/branch/${branchId}/transfer-stock`);
      // return res.status(404).json({ error: 'Target Branch not found!' });
    }

    // Check if product already exists in target branch
    const checkProduct = await BranchModel.getExistingBranchProduct(targetBranchId, productId);

    if (checkProduct.length < 1) {
      // Insert new stock in target
      await BranchModel.insertAndSubtract(branchId, branch[0].branch_name, targetBranchId, targetBranch[0].branch_name, productId, type, convertedTransferQuantity);
      console.log('Inserted and subtracted');
    } else {
      // Update existing stock in target and subtract from source branch
      await BranchModel.updateAndSubtract(branchId, branch[0].branch_name, targetBranchId, targetBranch[0].branch_name, productId, type, convertedTransferQuantity);
      console.log('Updated and subtracted');
    }

    req.flash('success_msg', 'Stock Transfer successful!')
    return res.redirect(`/branch/${branchId}/transfer-stock`);
    // return res.status(200).json({ message: 'Transfer successful!' });

  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Error transferring stock!')
    return res.redirect(`/branch/${branchId}/transfer-stock`);
    // return res.status(500).json({ error: 'Error transferring stock!' });
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
  checkLowStockLevel,
  checkWholesaleStockLevel,
  checkRetailStockLevel,
  getBranchNotificationsPage,
  getStockTransferPage,
  transferBranchStock
};
