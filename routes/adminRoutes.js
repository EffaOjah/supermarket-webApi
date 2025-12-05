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

module.exports = router;