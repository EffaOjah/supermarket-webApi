const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');
const { requireRole } = require('../middleware/roleAuth');

// Accountant Dashboard & Actions
router.get('/accountant/dashboard', requireRole(['accountant']), requestController.getAccountantDashboard);
router.post('/accountant/requests/:id/approve', requireRole(['accountant']), requestController.handleApproval);
router.post('/accountant/requests/:id/reject', requireRole(['accountant']), requestController.handleRejection);

// Accountant Sales Rep Management
router.get('/accountant/sales-reps', requireRole(['accountant']), requestController.getAccountantSalesReps);
router.get('/accountant/sales-reps/add', requireRole(['accountant']), requestController.getAccountantAddSalesRep);
router.post('/accountant/sales-reps/add', requireRole(['accountant']), requestController.postAccountantAddSalesRep);
router.get('/accountant/sales-reps/:id/edit', requireRole(['accountant']), requestController.getAccountantEditSalesRep);
router.post('/accountant/sales-reps/:id/edit', requireRole(['accountant']), requestController.postAccountantUpdateSalesRep);
router.post('/accountant/sales-reps/:id/delete', requireRole(['accountant']), requestController.postAccountantDeleteSalesRep);
router.get('/accountant/sales-reps/:id/payment', requireRole(['accountant']), requestController.getAccountantSalesRepPayment);
router.post('/accountant/sales-reps/:id/payment', requireRole(['accountant']), requestController.postAccountantHandleSalesRepPayment);

// Accountant Sales Rep Invoices
router.get('/accountant/sales-rep-invoices', requireRole(['accountant']), requestController.getAccountantSalesRepInvoices);
router.get('/accountant/sales-rep-invoices/create', requireRole(['accountant']), requestController.getAccountantCreateSalesRepInvoice);
router.post('/accountant/sales-rep-invoices/create', requireRole(['accountant']), requestController.postAccountantCreateSalesRepInvoice);
router.get('/accountant/sales-rep-invoices/:id', requireRole(['accountant']), requestController.getAccountantSalesRepInvoiceDetails);
router.get('/accountant/sales-rep-invoices/:id/payment', requireRole(['accountant']), requestController.getAccountantSalesRepInvoicePayment);
router.post('/accountant/sales-rep-invoices/:id/payment', requireRole(['accountant']), requestController.postAccountantRecordSalesRepInvoicePayment);


// Operations Dashboard & Actions
router.get('/operations/dashboard', requireRole(['operations']), requestController.getOpsDashboard);
router.post('/operations/requests/:id/approve', requireRole(['operations']), requestController.handleApproval);
router.post('/operations/requests/:id/reject', requireRole(['operations']), requestController.handleRejection);

// Operations Products
router.get('/operations/products', requireRole(['operations']), requestController.getOpsProducts);

// Operations Sales Rep Management
router.get('/operations/sales-reps', requireRole(['operations']), requestController.getOpsSalesReps);
router.get('/operations/sales-reps/add', requireRole(['operations']), requestController.getOpsAddSalesRep);
router.post('/operations/sales-reps/add', requireRole(['operations']), requestController.postOpsAddSalesRep);
router.get('/operations/sales-reps/:id/edit', requireRole(['operations']), requestController.getOpsEditSalesRep);
router.post('/operations/sales-reps/:id/edit', requireRole(['operations']), requestController.postOpsUpdateSalesRep);
router.post('/operations/sales-reps/:id/delete', requireRole(['operations']), requestController.postOpsDeleteSalesRep);
router.get('/operations/sales-reps/:id/payment', requireRole(['operations']), requestController.getOpsSalesRepPayment);
router.post('/operations/sales-reps/:id/payment', requireRole(['operations']), requestController.postOpsHandleSalesRepPayment);

// Operations Sales Rep Invoices
router.get('/operations/sales-rep-invoices', requireRole(['operations']), requestController.getOpsSalesRepInvoices);
router.get('/operations/sales-rep-invoices/create', requireRole(['operations']), requestController.getOpsCreateSalesRepInvoice);
router.post('/operations/sales-rep-invoices/create', requireRole(['operations']), requestController.postOpsCreateSalesRepInvoice);
router.get('/operations/sales-rep-invoices/:id', requireRole(['operations']), requestController.getOpsSalesRepInvoiceDetails);
router.get('/operations/sales-rep-invoices/:id/payment', requireRole(['operations']), requestController.getOpsSalesRepInvoicePayment);
router.post('/operations/sales-rep-invoices/:id/payment', requireRole(['operations']), requestController.postOpsRecordSalesRepInvoicePayment);


// Warehouse Dashboard & Actions
router.get('/warehouse/dashboard', requireRole(['warehouse']), requestController.getWarehouseDashboard);
router.post('/warehouse/requests/:id/approve', requireRole(['warehouse']), requestController.handleApproval);
router.post('/warehouse/requests/:id/reject', requireRole(['warehouse']), requestController.handleRejection);

// Warehouse Products
router.get('/warehouse/products', requireRole(['warehouse']), requestController.getWarehouseProducts);

// Warehouse Sales Rep Management
router.get('/warehouse/sales-reps', requireRole(['warehouse']), requestController.getWarehouseSalesReps);
router.get('/warehouse/sales-reps/add', requireRole(['warehouse']), requestController.getWarehouseAddSalesRep);
router.post('/warehouse/sales-reps/add', requireRole(['warehouse']), requestController.postWarehouseAddSalesRep);
router.get('/warehouse/sales-reps/:id/edit', requireRole(['warehouse']), requestController.getWarehouseEditSalesRep);
router.post('/warehouse/sales-reps/:id/edit', requireRole(['warehouse']), requestController.postWarehouseUpdateSalesRep);
router.post('/warehouse/sales-reps/:id/delete', requireRole(['warehouse']), requestController.postWarehouseDeleteSalesRep);
router.get('/warehouse/sales-reps/:id/payment', requireRole(['warehouse']), requestController.getWarehouseSalesRepPayment);
router.post('/warehouse/sales-reps/:id/payment', requireRole(['warehouse']), requestController.postWarehouseHandleSalesRepPayment);

// Warehouse Sales Rep Invoices
router.get('/warehouse/sales-rep-invoices', requireRole(['warehouse']), requestController.getWarehouseSalesRepInvoices);
router.get('/warehouse/sales-rep-invoices/create', requireRole(['warehouse']), requestController.getWarehouseCreateSalesRepInvoice);
router.post('/warehouse/sales-rep-invoices/create', requireRole(['warehouse']), requestController.postWarehouseCreateSalesRepInvoice);
router.get('/warehouse/sales-rep-invoices/:id', requireRole(['warehouse']), requestController.getWarehouseSalesRepInvoiceDetails);
router.get('/warehouse/sales-rep-invoices/:id/payment', requireRole(['warehouse']), requestController.getWarehouseSalesRepInvoicePayment);
router.post('/warehouse/sales-rep-invoices/:id/payment', requireRole(['warehouse']), requestController.postWarehouseRecordSalesRepInvoicePayment);

module.exports = router;
