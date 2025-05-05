// Require Auth route
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

// Get all products route (GET)
router.get('/admin/all-products', verifyToken, adminController.getAllProducts);

// Get store branch using branch id (GET)
router.get('/admin/branch/:branchId', verifyToken, adminController.getStoreBranchById);

// Get all branch sales (GET)
router.get('/admin/branch/:branchId/sales', verifyToken, adminController.getBranchSales);

module.exports = router;