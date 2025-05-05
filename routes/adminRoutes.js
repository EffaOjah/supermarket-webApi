// Require Auth route
const adminController = require('../controllers/adminController');

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
router.get('/admin/dashboard', adminController.getDashboard);

// Product upload route (GET)
router.get('/admin/product-upload', adminController.getProductUpload);

// Upload product route (POST)
router.post('/admin/upload-product', adminController.uploadProducts);

// Get all products route (GET)
router.get('/admin/all-products', adminController.getAllProducts);

// Get store branch using branch id (GET)
router.get('/admin/branch/:branchId', adminController.getStoreBranchById);

// Get all branch sales (GET)
router.get('/admin/branch/:branchId/sales', adminController.getBranchSales);

module.exports = router;