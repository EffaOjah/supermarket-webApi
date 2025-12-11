const { Router } = require('express');
const router = Router();
const invoiceController = require('../controllers/invoiceController');

// Invoice Routes
router.get('/invoices', invoiceController.renderInvoiceList);
router.get('/invoices/create', invoiceController.renderCreateInvoice);
router.post('/invoices/create', invoiceController.createInvoice);
router.post('/invoices/pay/:invoiceId', invoiceController.recordPayment);
router.get('/invoices/:invoiceId', invoiceController.viewInvoiceDetails);

// Customer Routes
router.get('/customers', invoiceController.renderCustomerList);
router.post('/customers/add', invoiceController.addCustomer);

module.exports = router;
