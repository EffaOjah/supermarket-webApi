// File: controllers/adminController.js

// Admin Model
const AdminModel = require("../models/adminModel");
const SalesRepModel = require('../models/salesRepModel');
const RequestModel = require('../models/requestModel');
const LedgerModel = require('../models/ledgerModel');


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
    return res.redirect(`/ product / ${productId}/update`);
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

const viewRequestDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const request = await RequestModel.getRequestById(id);
    console.log(request);
    if (!request) {
      req.flash('error_msg', 'Request not found');
      return res.redirect('/admin/product-requests');
    }
    res.render('admin/request-details', { request });
  } catch (error) {
    console.error(error);
    res.render('error-page');
  }
};

const getRecordRepPayment = async (req, res) => {
  const { id } = req.params;
  const salesReps = await SalesRepModel.getAllSalesReps();
  const rep = salesReps.find(r => r.id == id);
  if (!rep) {
    req.flash('error_msg', 'Sales Rep not found');
    return res.redirect('/admin/sales-reps');
  }
  res.render('admin/sales-rep-payment', { rep });
};

const handleRepPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, paymentDate, paymentMethod, reference, notes } = req.body;

    const salesReps = await SalesRepModel.getAllSalesReps();
    const rep = salesReps.find(r => r.id == id);
    if (!rep) {
      req.flash('error_msg', 'Sales Rep not found');
      return res.redirect('/admin/sales-reps');
    }

    if (parseFloat(amount) <= 0) {
      req.flash('error_msg', 'Payment amount must be greater than 0');
      return res.redirect(`/admin/sales-reps/${id}/payment`);
    }

    if (parseFloat(amount) > parseFloat(rep.debt)) {
      req.flash('error_msg', `Payment amount (₦${amount}) exceeds current debt (₦${rep.debt})`);
      return res.redirect(`/admin/sales-reps/${id}/payment`);
    }

    await SalesRepModel.recordPayment({
      salesRepId: id,
      amount,
      paymentDate,
      paymentMethod,
      reference,
      notes
    });


    // Post to Ledger
    // Debit Cash (1000), Credit Rep Receivables (assuming 1200 akin to customers)
    // Ideally we might want a specific account for Reps, but 1200 is fine for now as per plan
    // Post to Ledger
    // Debit Cash (1000), Credit Rep Receivables (assuming 1200 akin to customers)
    // Ideally we might want a specific account for Reps, but 1200 is fine for now as per plan

    await LedgerModel.insertTransaction({

      transactionId: `TXN-REP-PAY-${id}-${Date.now()}`,
      transactionDate: paymentDate,
      transactionType: 'PAYMENT',
      referenceNumber: reference || `REP-PAY-${id}`,
      description: `Payment from Sales Rep: ${rep ? rep.name : id}`,
      totalAmount: amount,
      createdBy: 'admin',
      entries: [
        {
          accountCode: '1000', // Cash
          entryType: 'DEBIT',
          amount: amount,
          description: `Payment from Rep ${rep ? rep.name : id}`
        },
        {
          accountCode: '1200', // Accounts Receivable
          entryType: 'CREDIT',
          amount: amount,
          description: `Payment from Rep ${rep ? rep.name : id}`
        }
      ]
    });

    req.flash('success_msg', 'Payment recorded successfully');
    res.redirect('/admin/sales-reps');
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Error recording payment');
    res.redirect('/admin/sales-reps');
  }
};

// Sales Rep Management
const getAddSalesRep = (req, res) => {
  res.render('admin/add-sales-rep');
};

const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

const addSalesRep = async (req, res) => {
  const { name, email, phone } = req.body;
  try {
    if (!isValidEmail(email)) {
      req.flash('error_msg', 'Invalid email address');
      return res.redirect('/admin/sales-reps/add');
    }
    const uniqueId = 'REP-' + Math.floor(1000 + Math.random() * 9000); // Simple ID generation
    await SalesRepModel.createSalesRep({ name, email, phone, uniqueId });
    req.flash('success_msg', `Sales Rep added successfully. Unique ID: ${uniqueId}`);
    res.redirect('/admin/sales-reps');
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Error adding sales rep');
    res.redirect('/admin/sales-reps/add');
  }
};

const getAllSalesRepsList = async (req, res) => {
  try {
    const salesReps = await SalesRepModel.getAllSalesReps();
    res.render('admin/sales-reps', { salesReps });
  } catch (error) {
    console.error(error);
    res.render('error-page');
  }
};

const getEditSalesRep = async (req, res) => {
  try {
    const salesRep = await SalesRepModel.getSalesRepById(req.params.id);
    if (!salesRep) {
      req.flash('error_msg', 'Sales Representative not found');
      return res.redirect('/admin/sales-reps');
    }
    res.render('admin/edit-sales-rep', { salesRep });
  } catch (error) {
    console.error(error);
    res.render('error-page');
  }
};

const updateSalesRep = async (req, res) => {
  const { id } = req.params;
  const { name, email, phone } = req.body;
  try {
    if (!isValidEmail(email)) {
      req.flash('error_msg', 'Invalid email address');
      return res.redirect(`/admin/sales-reps/${id}/edit`);
    }
    await SalesRepModel.updateSalesRep(id, { name, email, phone });
    req.flash('success_msg', 'Sales Representative updated successfully');
    res.redirect('/admin/sales-reps');
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Error updating sales representative');
    res.redirect(`/admin/sales-reps/${id}/edit`);
  }
};

const getAllProductRequests = async (req, res) => {
  try {
    const requests = await RequestModel.getAllRequests();
    res.render('admin/product-requests', { requests });
  } catch (error) {
    console.error(error);
    res.render('error-page');
  }
};

const deleteSalesRep = async (req, res) => {
  const { id } = req.params;
  try {
    await SalesRepModel.deleteSalesRep(id);
    req.flash('success_msg', 'Sales Representative deleted successfully');
    res.redirect('/admin/sales-reps');
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Error deleting sales representative. It may be in use.');
    res.redirect('/admin/sales-reps');
  }
};

// Sales Rep Invoice Management
const renderSalesRepInvoiceList = async (req, res) => {
  try {
    const invoices = await SalesRepModel.getAllSalesRepInvoices();
    res.render('admin/sales-rep-invoices-list', { invoices });
  } catch (error) {
    console.error('Error fetching sales rep invoices:', error);
    req.flash('error_msg', 'Error loading invoices');
    res.redirect('/admin/dashboard');
  }
};

const renderCreateSalesRepInvoice = async (req, res) => {
  try {
    const salesReps = await SalesRepModel.getAllSalesReps();
    const products = await AdminModel.getProducts();
    res.render('admin/create-sales-rep-invoice', { salesReps, products });
  } catch (error) {
    console.error('Error loading create invoice page:', error);
    req.flash('error_msg', 'Error loading page');
    res.redirect('/admin/sales-rep-invoices');
  }
};

const createSalesRepInvoice = async (req, res) => {
  try {
    const { salesRepId, invoiceDate, dueDate, items } = req.body;

    // Parse items if it comes as a string
    let parsedItems = typeof items === 'string' ? JSON.parse(items) : items;

    if (!salesRepId || !parsedItems || parsedItems.length === 0) {
      req.flash('error_msg', 'Invalid invoice data');
      return res.redirect('/admin/sales-rep-invoices/create');
    }

    // Validate that all items have a price > 0
    for (const item of parsedItems) {
      if (!item.unitPrice || parseFloat(item.unitPrice) <= 0) {
        req.flash('error_msg', `Product "${item.productName}" does not have a valid price. Please ensure all products have prices before creating the invoice.`);
        return res.redirect('/admin/sales-rep-invoices/create');
      }
    }

    const totalAmount = parsedItems.reduce((sum, item) => sum + parseFloat(item.total), 0);
    const invoiceNumber = `SREP-INV-${Date.now()}`;

    // 1. Create Invoice in DB
    const invoiceData = {
      invoiceNumber,
      salesRepId,
      invoiceDate,
      dueDate,
      totalAmount,
      reference: `Invoice for Sales Rep #${salesRepId}`
    };

    const result = await SalesRepModel.createSalesRepInvoice(invoiceData, parsedItems);
    const invoiceId = result.invoiceId;

    // 2. Update Sales Rep Debt (Increase)
    await SalesRepModel.updateDebt(salesRepId, totalAmount);

    // 3. Post to General Ledger
    // Debit Accounts Receivable, Credit Sales
    const ledgerEntry = {
      transactionId: `TXN-SREP-INV-${invoiceId}`,
      transactionDate: invoiceDate,
      transactionType: 'INVOICE',
      referenceNumber: invoiceNumber,
      description: `Sales Rep Invoice ${invoiceNumber}`,
      totalAmount: totalAmount,
      createdBy: 'admin',
      entries: [
        {
          accountCode: '1200', // Accounts Receivable
          entryType: 'DEBIT',
          amount: totalAmount,
          description: `Sales Rep Invoice ${invoiceNumber} - Receivable`
        },
        {
          accountCode: '4000', // Sales Revenue
          entryType: 'CREDIT',
          amount: totalAmount,
          description: `Sales Rep Invoice ${invoiceNumber} - Revenue`
        }
      ]
    };

    await LedgerModel.insertTransaction(ledgerEntry);

    req.flash('success_msg', 'Sales Rep Invoice created and posted to ledger successfully');
    res.redirect('/admin/sales-rep-invoices');

  } catch (error) {
    console.error('Error creating sales rep invoice:', error);
    req.flash('error_msg', 'Failed to create invoice: ' + error.message);
    res.redirect('/admin/sales-rep-invoices/create');
  }
};

const viewSalesRepInvoiceDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const invoice = await SalesRepModel.getSalesRepInvoiceById(id);

    if (!invoice) {
      req.flash('error_msg', 'Invoice not found');
      return res.redirect('/admin/sales-rep-invoices');
    }

    const totalPaid = await SalesRepModel.getInvoiceTotalPaid(id);
    const balance = parseFloat(invoice.total_amount) - parseFloat(totalPaid);
    const payments = await SalesRepModel.getInvoicePayments(id);

    res.render('admin/sales-rep-invoice-details', { invoice, totalPaid, balance, payments });
  } catch (error) {
    console.error('Error viewing invoice:', error);
    req.flash('error_msg', 'Error loading invoice details');
    res.redirect('/admin/sales-rep-invoices');
  }
};

const renderSalesRepInvoicePaymentForm = async (req, res) => {
  try {
    const { id } = req.params;
    const invoice = await SalesRepModel.getSalesRepInvoiceById(id);

    if (!invoice) {
      req.flash('error_msg', 'Invoice not found');
      return res.redirect('/admin/sales-rep-invoices');
    }

    if (invoice.status === 'PAID') {
      req.flash('warning_msg', 'Invoice is already fully paid');
      return res.redirect(`/admin/sales-rep-invoices/${id}`);
    }

    // Get total paid so far
    const totalPaid = await SalesRepModel.getInvoiceTotalPaid(id);
    const balance = parseFloat(invoice.total_amount) - parseFloat(totalPaid);
    const payments = await SalesRepModel.getInvoicePayments(id);

    res.render('admin/sales-rep-invoice-payment', { invoice, totalPaid, balance, payments });
  } catch (error) {
    console.error('Error loading payment form:', error);
    req.flash('error_msg', 'Error loading payment form');
    res.redirect('/admin/sales-rep-invoices');
  }
};

const recordSalesRepInvoicePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, paymentDate, paymentMethod, reference, notes } = req.body;

    const invoice = await SalesRepModel.getSalesRepInvoiceById(id);

    if (!invoice) {
      req.flash('error_msg', 'Invoice not found');
      return res.redirect('/admin/sales-rep-invoices');
    }

    if (invoice.status === 'PAID') {
      req.flash('warning_msg', 'Invoice is already fully paid');
      return res.redirect('/admin/sales-rep-invoices');
    }

    // Validate payment amount
    const paymentAmount = parseFloat(amount);
    if (isNaN(paymentAmount) || paymentAmount <= 0) {
      req.flash('error_msg', 'Invalid payment amount. Please enter a positive value.');
      return res.redirect(`/admin/sales-rep-invoices/${id}/payment`);
    }

    // Get current total paid
    const totalPaid = await SalesRepModel.getInvoiceTotalPaid(id);
    const balance = parseFloat(invoice.total_amount) - parseFloat(totalPaid);

    if (paymentAmount > balance) {
      req.flash('error_msg', `Payment amount (₦${paymentAmount}) exceeds remaining balance (₦${balance})`);
      return res.redirect(`/admin/sales-rep-invoices/${id}/payment`);
    }

    // 1. Record Payment
    await SalesRepModel.recordInvoicePayment({
      invoiceId: id,
      amount: paymentAmount,
      paymentDate,
      paymentMethod,
      reference,
      notes
    });

    // 2. Update Sales Rep Debt (Decrease)
    await SalesRepModel.updateDebt(invoice.sales_rep_id, -paymentAmount);

    // 3. Check if invoice is now fully paid
    const newTotalPaid = parseFloat(totalPaid) + paymentAmount;
    if (newTotalPaid >= parseFloat(invoice.total_amount)) {
      await SalesRepModel.updateSalesRepInvoiceStatus(id, 'PAID');
    } else if (newTotalPaid > 0) {
      await SalesRepModel.updateSalesRepInvoiceStatus(id, 'PARTIALLY_PAID');
    }

    // 4. Post to Ledger
    const ledgerEntry = {
      transactionId: `TXN-SREP-PAY-${id}-${Date.now()}`,
      transactionDate: paymentDate,
      transactionType: 'PAYMENT',
      referenceNumber: invoice.invoice_number,
      description: `Payment for Sales Rep Invoice ${invoice.invoice_number}`,
      totalAmount: paymentAmount,
      createdBy: 'admin',
      entries: [
        {
          accountCode: '1000', // Cash
          entryType: 'DEBIT',
          amount: paymentAmount,
          description: `Payment for SREP INV ${invoice.invoice_number}`
        },
        {
          accountCode: '1200', // Accounts Receivable
          entryType: 'CREDIT',
          amount: paymentAmount,
          description: `Payment for SREP INV ${invoice.invoice_number}`
        }
      ]
    };

    await LedgerModel.insertTransaction(ledgerEntry);

    req.flash('success_msg', `Payment of ₦${paymentAmount.toLocaleString()} recorded successfully`);
    res.redirect(`/admin/sales-rep-invoices/${id}`);

  } catch (error) {
    console.error('Error recording payment:', error);
    req.flash('error_msg', 'Failed to record payment');
    res.redirect('/admin/sales-rep-invoices');
  }
};

const handleRequestAction = async (req, res) => {
  const { action } = req.body; // 'approve' or 'decline'
  const { id } = req.params;

  try {
    const request = await RequestModel.getRequestById(id);
    if (!request) return res.status(404).send('Request not found');

    if (action === 'approve') {
      // Check debt limit if needed? For now just approve.
      await RequestModel.updateRequestStatus(id, 'APPROVED');
      await SalesRepModel.updateDebt(request.sales_rep_id, request.total_amount);
      req.flash('success_msg', 'Request approved');
    } else if (action === 'decline') {
      await RequestModel.updateRequestStatus(id, 'DECLINED');
      req.flash('success_msg', 'Request declined');
    }
    res.redirect('/admin/product-requests');
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Error processing request');
    res.redirect('/admin/product-requests');
  }
};

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
  getSalesAnalysisFromDateRange,
  getAddSalesRep,
  addSalesRep,
  getAllSalesRepsList,
  getAllProductRequests,
  handleRequestAction,
  viewRequestDetails,
  getRecordRepPayment,
  handleRepPayment,
  getEditSalesRep,
  updateSalesRep,
  deleteSalesRep,
  renderSalesRepInvoiceList,
  renderCreateSalesRepInvoice,
  createSalesRepInvoice,
  viewSalesRepInvoiceDetails,
  renderSalesRepInvoicePaymentForm,
  recordSalesRepInvoicePayment
};