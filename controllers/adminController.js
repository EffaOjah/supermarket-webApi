// File: controllers/adminController.js

// Admin Model
const AdminModel = require("../models/adminModel");

function validatePrice(req, res, price, label, redirectUrl) {
  if (price && price < 1) {
    console.log(`Invalid ${label} price`);
    req.flash('error_msg', `Invalid ${label} price`);
    return res.redirect(redirectUrl);
  }
}

// Get dashboard page
const getDashboard = async (req, res) => {
  try {
    // Get all branches
    const branches = await AdminModel.getBranches();

    branches.forEach((branch) => {
      const inspectedDate = new Date(branch.last_inspected);
      branch.last_inspected = inspectedDate.toString().split(" GMT")[0];
    });

    console.log("Branches:", branches);

    const products = await AdminModel.getProducts();

    res.render("dashboard", { branches, products });
  } catch (error) {
    console.log("An error occurred: ", error);
    return res.render("error-page");
  }
};

// Get product upload page
const getProductUpload = async (req, res) => {
  try {
    // Get all suppliers
    const suppliers = await AdminModel.getSuppliers();
    console.log("Suppliers:", suppliers);

    const products = await AdminModel.getProducts();

    res.render("upload-products", { suppliers, products });
  } catch (error) {
    console.log("An error occurred: ", error);
    return res.render("error-page");
  }
};

// Upload product
const uploadProducts = async (req, res) => {
  // console.log('File details:', req.file);
  console.log("Form fields:", req.body);

  const { productName, wholesaleCostPrice, wholesaleSellingPrice, retailCostPrice, retailSellingPrice, category, supplierId } =
    req.body;

  console.log('req.body: ', req.body);

  // Check if the necessary details were provided
  if (!productName || !category || !supplierId) {
    console.log('Please provide all details');

    req.flash('error_msg', 'Please provide all details');
    return res.redirect("/admin/product-upload");
  }

  // Make sure the prices ain't less than 1
  const redirect = validatePrice(req, res, wholesaleCostPrice, 'wholesale cost', '/admin/product-upload') || validatePrice(req, res, wholesaleSellingPrice, 'wholesale selling', '/admin/product-upload') || validatePrice(req, res, retailCostPrice, 'retail cost', '/admin/product-upload') || validatePrice(req, res, retailSellingPrice, 'retail sellling', '/admin/product-upload');
  if (redirect) return redirect;

  try {
    // Check if there's a product with the same name
    const checkProduct = await AdminModel.getProductByName(productName);

    if (checkProduct.length > 0) {
      console.log('This product already exists');

      req.flash('error_msg', 'This product already exists');
      return res.redirect("/admin/product-upload");
    }

    // Insert into the database
    const addProduct = await AdminModel.uploadProduct(
      productName,
      Number(wholesaleCostPrice),
      Number(wholesaleSellingPrice),
      Number(retailCostPrice),
      Number(retailSellingPrice),
      supplierId,
      category
    );
    console.log(addProduct);

    req.flash('success_msg', 'Product upload successful');
    return res.redirect("/admin/product-upload");
  } catch (error) {
    console.log("Error uploading product:", error);
    req.flash('error_msg', 'Product upload failed');
    return res.redirect("/admin/product-upload");
  }
};

// Get product update page
const getProductUpdate = async (req, res) => {
  try {
    const { productId } = req.params;

    // Get all suppliers
    const suppliers = await AdminModel.getSuppliers();
    console.log("Suppliers:", suppliers);

    const products = await AdminModel.getProducts();

    // Get the product
    const product = await AdminModel.getProductById(productId);
    console.log('Product: ', product);

    res.render("edit-product", { suppliers, products, product: product[0] });
  } catch (error) {
    console.log("An error occurred: ", error);
    return res.render("error-page");
  }
};

// Update product
const updateProduct = async (req, res) => {
  // console.log('File details:', req.file);

  const { productId, productName, wholesaleCostPrice, wholesaleSellingPrice, retailCostPrice, retailSellingPrice, category, supplierId } =
    req.body;

  console.log('req.body: ', req.body);

  // Check if the necessary details were provided
  if (!productId || !productName || !wholesaleCostPrice || !wholesaleSellingPrice || !retailCostPrice || !retailSellingPrice || !category || !supplierId) {
    console.log('Please provide all details');

    req.flash('error_msg', 'Please provide all details');
    return res.redirect(`/product/${productId}/update`);
  }

  // Make sure the prices ain't less than 1
  const redirect = validatePrice(req, res, wholesaleCostPrice, 'wholesale cost', `/product/${productId}/update`) || validatePrice(req, res, wholesaleSellingPrice, 'wholesale selling', `/product/${productId}/update`) || validatePrice(req, res, retailCostPrice, 'retail cost', `/product/${productId}/update`) || validatePrice(req, res, retailSellingPrice, 'retail sellling', `/product/${productId}/update`);
  if (redirect) return redirect;

  try {
    // Update the product in the database
    const editProduct = await AdminModel.updateProduct(
      productName,
      Number(wholesaleCostPrice),
      Number(wholesaleSellingPrice),
      Number(retailCostPrice),
      Number(retailSellingPrice),
      Number(supplierId),
      category,
      productId
    );
    console.log(editProduct);

    req.flash('success_msg', 'Product update successful');
    return res.redirect(`/product/${productId}/update`);
  } catch (error) {
    console.log("Error uploading product:", error);
    req.flash('error_msg', 'Product update failed');
    return res.redirect(`/product/${productId}/update`);
  }
};

// Get all products
const getAllProducts = async (req, res) => {
  try {
    const products = await AdminModel.getProducts();

    return res.render("all-products", { products });
  } catch (error) {
    console.log("Error fetching products:", error);
    return res.status(500).json({ message: "Internal Server Error", error });
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
    console.log("Error fetching branch:", error);
    return res.status(500).json({ message: "Internal Server Error", error });
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
    console.log("Error fetching branch sales:", error);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

// Get today's sales analysis
const getTodaySalesAnalysis = async (req, res) => {
  try {
    const { date, branchId } = req.query;
    console.log(branchId);


    let branch = await AdminModel.getStoreBranchById(branchId);
    console.log(branch);

    if (branch.length < 1) {
      console.log('Invalid branch ID');
      return res.status(404).json({ error: 'Invalid branch ID' })
    }

    branch = branch[0].branch_id;;

    const getWholesaleAnalysis = await AdminModel.getTheAnalysis('Wholesale', date, branch);

    const getRetailAnalysis = await AdminModel.getTheAnalysis('Retail', date, branch);

    return res.status(200).json({ wholesaleAnalysis: getWholesaleAnalysis, retailAnalysis: getRetailAnalysis });
  } catch (error) {
    console.log("Error fetching sales analysis:", error);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
}

// Get sales analysis from date range
const getSalesAnalysisFromDateRange = async (req, res) => {
  try {
    const { branchId, startDate, endDate } = req.query;
    console.log(branchId);

    let branch = await AdminModel.getStoreBranchById(branchId);
    console.log(branch);

    if (branch.length < 1) {
      console.log('Invalid branch ID');
      return res.status(404).json({ error: 'Invalid branch ID' })
    }

    branch = branch[0].branch_id;;

    const getWholesaleAnalysis = await AdminModel.getSalesAnalysisFromRange(branch, 'Wholesale', startDate, endDate);

    const getRetailAnalysis = await AdminModel.getSalesAnalysisFromRange(branch, 'Retail', startDate, endDate);

    return res.status(200).json({ wholesaleAnalysis: getWholesaleAnalysis, retailAnalysis: getRetailAnalysis });
  } catch (error) {
    console.log("Error fetching sales analysis:", error);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
}

module.exports = {
  getDashboard,
  getProductUpload,
  uploadProducts,
  getProductUpdate,
  updateProduct,
  getAllProducts,
  getStoreBranchById,
  getBranchSales,
  getTodaySalesAnalysis,
  getSalesAnalysisFromDateRange
};
