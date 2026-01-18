const express = require('express');
const router = express.Router();
const payrollConfigController = require('../controllers/payrollConfigController');
const payrollController = require('../controllers/payrollController');
const { verifyToken, requireRole } = require('../middleware/jwt');

// Pages - Admin, Warehouse, Operations
router.get('/setup', verifyToken, requireRole(['admin', 'warehouse', 'operations']), payrollConfigController.getStructureSetupPage);
router.get('/structure/:id', verifyToken, requireRole(['admin', 'warehouse', 'operations']), payrollConfigController.getStructureDetailsPage);
router.get('/run', verifyToken, requireRole(['admin', 'warehouse', 'operations']), payrollController.getRunPayrollPage);
router.get('/history', verifyToken, requireRole(['admin', 'warehouse', 'operations']), payrollController.getPayrollHistory);
router.get('/run/:runId', verifyToken, requireRole(['admin', 'warehouse', 'operations']), payrollController.viewPayrollRun);
router.get('/payslip/:id/print', verifyToken, requireRole(['admin', 'warehouse', 'operations']), payrollController.printPayslip);

// Actions - Admin, Warehouse, Operations
router.post('/structure/create', verifyToken, requireRole(['admin', 'warehouse', 'operations']), payrollConfigController.createStructure);
router.post('/component/create', verifyToken, requireRole(['admin', 'warehouse', 'operations']), payrollConfigController.createComponent);
router.post('/structure/add-component', verifyToken, requireRole(['admin', 'warehouse', 'operations']), payrollConfigController.addComponentToStructure);
router.post('/process', verifyToken, requireRole(['admin', 'warehouse', 'operations']), payrollController.processPayroll);

// Deletion Routes - Admin, Warehouse, Operations
router.post('/structure/delete/:id', verifyToken, requireRole(['admin', 'warehouse', 'operations']), payrollConfigController.deleteStructure);
router.post('/component/delete/:id', verifyToken, requireRole(['admin', 'warehouse', 'operations']), payrollConfigController.deleteComponent);
router.post('/structure/remove-component', verifyToken, requireRole(['admin', 'warehouse', 'operations']), payrollConfigController.removeComponentFromStructure);

module.exports = router;
