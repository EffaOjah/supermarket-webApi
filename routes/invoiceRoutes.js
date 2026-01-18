const { Router } = require('express');
const router = Router();
const invoiceController = require('../controllers/invoiceController');
const { requireRole } = require('../middleware/roleAuth');

// Invoice Routes
router.get('/invoices', requireRole(['admin', 'accountant']), invoiceController.renderInvoiceList);
router.get('/invoices/create', requireRole(['admin', 'accountant']), invoiceController.renderCreateInvoice);
router.post('/invoices/create', requireRole(['admin', 'accountant']), invoiceController.createInvoice);
router.post('/invoices/pay/:invoiceId', requireRole(['admin', 'accountant']), invoiceController.recordPayment);
router.get('/invoices/:invoiceId', requireRole(['admin', 'accountant']), invoiceController.viewInvoiceDetails);

// Customer Routes
router.get('/customers', requireRole(['admin', 'accountant']), invoiceController.renderCustomerList);
router.post('/customers/add', requireRole(['admin', 'accountant']), invoiceController.addCustomer);

module.exports = router;
