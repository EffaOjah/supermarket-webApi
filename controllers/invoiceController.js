const invoiceModel = require('../models/invoiceModel');
const customerModel = require('../models/customerModel');
const ledgerModel = require('../models/ledgerModel');

// Header variable for Ledger Account Codes
// Ideally these should be in a config or constants file
// ACCOUNT RECEIVABLE CODE: '1200' (Asset)
// SALES REVENUE CODE: '4000' (Revenue)
// CASH/BANK CODE: '1000' (Asset)
const ACCOUNTS = {
    RECEIVABLE: '1200',
    SALES: '4000',
    CASH: '1000'
};

// Render Invoice List
const renderInvoiceList = async (req, res) => {
    try {
        const invoices = await invoiceModel.getAllInvoices();
        res.render('invoices/list', { invoices });
    } catch (error) {
        console.error('Error fetching invoices:', error);
        req.flash('error_msg', 'Error loading invoices');
        res.redirect('/admin/dashboard');
    }
};

// Render Create Invoice Page
const renderCreateInvoice = async (req, res) => {
    try {
        const customers = await customerModel.getAllCustomers();
        res.render('invoices/create', { customers });
    } catch (error) {
        console.error('Error loading create invoice page:', error);
        req.flash('error_msg', 'Error loading page');
        res.redirect('/invoices');
    }
};

// Create Invoice
const createInvoice = async (req, res) => {
    try {
        const { customerId, invoiceDate, dueDate, items } = req.body;

        // Parse items if it comes as a string (from dynamic form)
        // Assuming client side sends `items` as JSON string or handled via array naming in form
        // For simplicity let's assume it's a JSON string from a hidden input populated by JS
        let parsedItems = typeof items === 'string' ? JSON.parse(items) : items;

        if (!customerId || !parsedItems || parsedItems.length === 0) {
            req.flash('error_msg', 'Invalid invoice data');
            return res.redirect('/invoices/create');
        }

        const totalAmount = parsedItems.reduce((sum, item) => sum + parseFloat(item.total), 0);
        const invoiceNumber = `INV-${Date.now()}`;

        // 1. Create Invoice in DB
        const invoiceData = {
            invoiceNumber,
            customerId,
            invoiceDate,
            dueDate,
            totalAmount,
            reference: `Invoice for Customer #${customerId}`
        };

        const result = await invoiceModel.createInvoice(invoiceData, parsedItems);
        const invoiceId = result.invoiceId;

        // 2. Update Customer Balance (Increase Receivable)
        await customerModel.updateCustomerBalance(customerId, totalAmount);

        // 3. Post to General Ledger
        // Debit Accounts Receivable, Credit Sales
        const ledgerEntry = {
            transactionId: `TXN-INV-${invoiceId}`,
            transactionDate: invoiceDate,
            transactionType: 'INVOICE', // Ensure this type exists in transaction_types or use 'SALES'
            referenceNumber: invoiceNumber,
            description: `Invoice ${invoiceNumber}`,
            totalAmount: totalAmount,
            createdBy: 'admin', // TODO: Get from session
            entries: [
                {
                    accountCode: ACCOUNTS.RECEIVABLE,
                    entryType: 'DEBIT',
                    amount: totalAmount,
                    description: `Invoice ${invoiceNumber} - Receivable`
                },
                {
                    accountCode: ACCOUNTS.SALES,
                    entryType: 'CREDIT',
                    amount: totalAmount,
                    description: `Invoice ${invoiceNumber} - Revenue`
                }
            ]
        };

        await ledgerModel.insertTransaction(ledgerEntry);

        req.flash('success_msg', 'Invoice created and posted to ledger successfully');
        res.redirect('/invoices');

    } catch (error) {
        console.error('Error creating invoice:', error);
        req.flash('error_msg', 'Failed to create invoice: ' + error.message);
        res.redirect('/invoices/create');
    }
};

// Record Payment
const recordPayment = async (req, res) => {
    try {
        const { invoiceId } = req.params;
        const invoice = await invoiceModel.getInvoiceById(invoiceId);

        if (!invoice) {
            req.flash('error_msg', 'Invoice not found');
            return res.redirect('/invoices');
        }

        if (invoice.status === 'PAID') {
            req.flash('warning_msg', 'Invoice is already paid');
            return res.redirect('/invoices');
        }

        // 1. Update Invoice Status
        await invoiceModel.updateInvoiceStatus(invoiceId, 'PAID');

        // 2. Update Customer Balance (Decrease Receivable)
        await customerModel.updateCustomerBalance(invoice.customer_id, -invoice.total_amount);

        // 3. Post to Ledger
        // Debit Cash, Credit Accounts Receivable
        const ledgerEntry = {
            transactionId: `TXN-PAY-${invoiceId}-${Date.now()}`,
            transactionDate: new Date().toISOString().split('T')[0],
            transactionType: 'PAYMENT',
            referenceNumber: invoice.invoice_number,
            description: `Payment for Invoice ${invoice.invoice_number}`,
            totalAmount: invoice.total_amount,
            createdBy: 'admin',
            entries: [
                {
                    accountCode: ACCOUNTS.CASH,
                    entryType: 'DEBIT',
                    amount: invoice.total_amount,
                    description: `Payment for INV ${invoice.invoice_number}`
                },
                {
                    accountCode: ACCOUNTS.RECEIVABLE,
                    entryType: 'CREDIT',
                    amount: invoice.total_amount,
                    description: `Payment for INV ${invoice.invoice_number}`
                }
            ]
        };

        await ledgerModel.insertTransaction(ledgerEntry);

        req.flash('success_msg', 'Payment recorded successfully');
        res.redirect('/invoices');

    } catch (error) {
        console.error('Error recording payment:', error);
        req.flash('error_msg', 'Failed to record payment');
        res.redirect('/invoices');
    }
};

const renderCustomerList = async (req, res) => {
    try {
        const customers = await customerModel.getAllCustomers();
        res.render('customers/list', { customers });
    } catch (error) {
        console.error(error);
        res.redirect('/admin/dashboard');
    }
}

const addCustomer = async (req, res) => {
    try {
        await customerModel.addCustomer(req.body);
        req.flash('success_msg', 'Customer added');
        res.redirect('/customers');
    } catch (error) {
        console.error(error);
        req.flash('error_msg', 'Failed to add customer');
        res.redirect('/customers');
    }
}

const viewInvoiceDetails = async (req, res) => {
    try {
        const { invoiceId } = req.params;
        const invoice = await invoiceModel.getInvoiceById(invoiceId);

        if (!invoice) {
            req.flash('error_msg', 'Invoice not found');
            return res.redirect('/invoices');
        }

        res.render('invoices/details', { invoice });
    } catch (error) {
        console.error('Error viewing invoice:', error);
        req.flash('error_msg', 'Error loading invoice details');
        res.redirect('/invoices');
    }
};

module.exports = {
    renderInvoiceList,
    renderCreateInvoice,
    createInvoice,
    recordPayment,
    renderCustomerList,
    addCustomer,
    viewInvoiceDetails
};
