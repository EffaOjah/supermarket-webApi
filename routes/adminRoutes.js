// Require Admin controller
const adminController = require('../controllers/adminController');

// Require JWT middleware
const { verifyToken, requireRole } = require('../middleware/jwt');

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


// Admin dashboard route (GET) - Admin, Warehouse, Operations
router.get('/admin/dashboard', verifyToken, requireRole(['admin', 'warehouse', 'operations']), adminController.getDashboard);

// Product upload route (GET) - Admin, Warehouse, Operations
router.get('/admin/product-upload', verifyToken, requireRole(['admin', 'warehouse', 'operations']), adminController.getProductUpload);

// Upload product route (POST) - Admin, Warehouse, Operations
router.post('/admin/upload-product', verifyToken, requireRole(['admin', 'warehouse', 'operations']), adminController.uploadProducts);

// Product update route (GET) - Admin, Warehouse, Operations
router.get('/product/:productId/update', verifyToken, requireRole(['admin', 'warehouse', 'operations']), adminController.getProductUpdate);

// Update product route (POST) - Admin, Warehouse, Operations
router.post('/admin/update-product', verifyToken, requireRole(['admin', 'warehouse', 'operations']), adminController.updateProduct);

// Get all products route (GET) - Admin, Warehouse, Operations
router.get('/admin/all-products', verifyToken, requireRole(['admin', 'warehouse', 'operations']), adminController.getAllProducts);

// Get store branch using branch id (GET) - Admin, Warehouse, Operations
router.get('/admin/branch/:branchId', verifyToken, requireRole(['admin', 'warehouse', 'operations']), adminController.getStoreBranchById);

// Get all branch sales (GET) - Admin, Warehouse, Operations
router.get('/admin/branch/:branchId/sales', verifyToken, requireRole(['admin', 'warehouse', 'operations']), adminController.getBranchSales);

// Get the sale record for the day
router.get('/admin/fetch-today-records', verifyToken, requireRole(['admin', 'warehouse', 'operations']), adminController.getTodaySalesAnalysis);

// Get the sale record from date range
router.get('/admin/fetch-records-from-range', verifyToken, requireRole(['admin', 'warehouse', 'operations']), adminController.getSalesAnalysisFromDateRange);

// Sales Rep Management Routes
router.get('/admin/sales-reps/add', verifyToken, requireRole(['admin', 'warehouse', 'operations']), adminController.getAddSalesRep);
router.post('/admin/sales-reps/add', verifyToken, requireRole(['admin', 'warehouse', 'operations']), adminController.addSalesRep);
router.get('/admin/sales-reps', verifyToken, requireRole(['admin', 'warehouse', 'operations']), adminController.getAllSalesRepsList);
router.get('/admin/sales-reps/:id/edit', verifyToken, requireRole(['admin', 'warehouse', 'operations']), adminController.getEditSalesRep);
router.post('/admin/sales-reps/:id/edit', verifyToken, requireRole(['admin', 'warehouse', 'operations']), adminController.updateSalesRep);
router.post('/admin/sales-reps/:id/delete', verifyToken, requireRole(['admin', 'warehouse', 'operations']), adminController.deleteSalesRep);
router.get('/admin/sales-reps/:id/payment', verifyToken, requireRole(['admin', 'warehouse', 'operations']), adminController.getRecordRepPayment);
router.post('/admin/sales-reps/:id/payment', verifyToken, requireRole(['admin', 'warehouse', 'operations']), adminController.handleRepPayment);

// Sales Rep Invoice Management Routes
router.get('/admin/sales-rep-invoices', verifyToken, requireRole(['admin', 'warehouse', 'operations']), adminController.renderSalesRepInvoiceList);
router.get('/admin/sales-rep-invoices/create', verifyToken, requireRole(['admin', 'warehouse', 'operations']), adminController.renderCreateSalesRepInvoice);
router.post('/admin/sales-rep-invoices/create', verifyToken, requireRole(['admin', 'warehouse', 'operations']), adminController.createSalesRepInvoice);
router.get('/admin/sales-rep-invoices/:id', verifyToken, requireRole(['admin', 'warehouse', 'operations']), adminController.viewSalesRepInvoiceDetails);
router.get('/admin/sales-rep-invoices/:id/payment', verifyToken, requireRole(['admin', 'warehouse', 'operations']), adminController.renderSalesRepInvoicePaymentForm);
router.post('/admin/sales-rep-invoices/:id/payment', verifyToken, requireRole(['admin', 'warehouse', 'operations']), adminController.recordSalesRepInvoicePayment);

// Product Requests Routes (Read-Only for Admin, Warehouse, Operations)
router.get('/admin/product-requests', verifyToken, requireRole(['admin', 'warehouse', 'operations']), adminController.getAllProductRequests);
router.get('/admin/product-requests/:id', verifyToken, requireRole(['admin', 'warehouse', 'operations']), adminController.viewRequestDetails);
// Action route removed - approvals handled by role-specific dashboards
// router.post('/admin/product-requests/:id/action', verifyToken, adminController.handleRequestAction);


module.exports = router;