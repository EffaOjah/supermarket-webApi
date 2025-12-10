const express = require('express');
const router = express.Router();
const payrollConfigController = require('../controllers/payrollConfigController');

const payrollController = require('../controllers/payrollController'); // Import the processing controller

// Pages
router.get('/setup', payrollConfigController.getStructureSetupPage);
router.get('/structure/:id', payrollConfigController.getStructureDetailsPage);
router.get('/run', payrollController.getRunPayrollPage);
router.get('/history', payrollController.getPayrollHistory);
router.get('/run/:runId', payrollController.viewPayrollRun);
router.get('/payslip/:id/print', payrollController.printPayslip);

// Actions
router.post('/structure/create', payrollConfigController.createStructure);
router.post('/component/create', payrollConfigController.createComponent);
router.post('/structure/add-component', payrollConfigController.addComponentToStructure);
router.post('/process', payrollController.processPayroll);

module.exports = router;
