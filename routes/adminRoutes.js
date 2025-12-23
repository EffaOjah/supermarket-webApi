// Require Admin controller
const adminController = require('../controllers/adminController');

// Require JWT middleware
const { verifyToken } = require('../middleware/jwt');

const { Router } = require('express');
const router = Router();

const multer = require('multer');

const path = require('path');

// Configure Multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../public/uploads');
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });


// Admin dashboard route (GET)
router.get('/admin/dashboard', verifyToken, adminController.getDashboard);

// Product upload route (GET)
router.get('/admin/product-upload', verifyToken, adminController.getProductUpload);

// Upload product route (POST)
router.post('/admin/upload-product', verifyToken, adminController.uploadProducts);

// Product update route (GET)
router.get('/product/:productId/update', verifyToken, adminController.getProductUpdate);

// Update product route (POST)
router.post('/admin/update-product', verifyToken, adminController.updateProduct);

// Get all products route (GET)
router.get('/admin/all-products', verifyToken, adminController.getAllProducts);

// Get store branch using branch id (GET)
router.get('/admin/branch/:branchId', verifyToken, adminController.getStoreBranchById);

// Get all branch sales (GET)
router.get('/admin/branch/:branchId/sales', verifyToken, adminController.getBranchSales);

// Get the sale record for the day
router.get('/admin/fetch-today-records', verifyToken, adminController.getTodaySalesAnalysis);

// Get the sale record from date range
router.get('/admin/fetch-records-from-range', verifyToken, adminController.getSalesAnalysisFromDateRange);

// Sales Rep Management Routes
router.get('/admin/sales-reps/add', verifyToken, adminController.getAddSalesRep);
router.post('/admin/sales-reps/add', verifyToken, adminController.addSalesRep);
router.get('/admin/sales-reps', verifyToken, adminController.getAllSalesRepsList);
router.get('/admin/sales-reps/:id/edit', verifyToken, adminController.getEditSalesRep);
router.post('/admin/sales-reps/:id/edit', verifyToken, adminController.updateSalesRep);
router.post('/admin/sales-reps/:id/delete', verifyToken, adminController.deleteSalesRep);
router.get('/admin/sales-reps/:id/payment', verifyToken, adminController.getRecordRepPayment);
router.post('/admin/sales-reps/:id/payment', verifyToken, adminController.handleRepPayment);

// Sales Rep Invoice Management Routes
router.get('/admin/sales-rep-invoices', verifyToken, adminController.renderSalesRepInvoiceList);
router.get('/admin/sales-rep-invoices/create', verifyToken, adminController.renderCreateSalesRepInvoice);
router.post('/admin/sales-rep-invoices/create', verifyToken, adminController.createSalesRepInvoice);
router.get('/admin/sales-rep-invoices/:id', verifyToken, adminController.viewSalesRepInvoiceDetails);
router.get('/admin/sales-rep-invoices/:id/payment', verifyToken, adminController.renderSalesRepInvoicePaymentForm);
router.post('/admin/sales-rep-invoices/:id/payment', verifyToken, adminController.recordSalesRepInvoicePayment);

// Product Requests Routes
router.get('/admin/product-requests', verifyToken, adminController.getAllProductRequests);
router.get('/admin/product-requests/:id', verifyToken, adminController.viewRequestDetails);
router.post('/admin/product-requests/:id/action', verifyToken, adminController.handleRequestAction);


module.exports = router;