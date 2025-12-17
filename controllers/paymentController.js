const paymentModel = require('../models/paymentModel');
const invoiceModel = require('../models/invoiceModel');
const customerModel = require('../models/customerModel');
const ledgerModel = require('../models/ledgerModel');

const ACCOUNTS = {
    RECEIVABLE: '1200',
    CASH: '1000'
};

// Render Receive Payment Page
const renderReceivePayment = async (req, res) => {
    try {
        const { invoiceId } = req.query;
        const customers = await customerModel.getAllCustomers();
        // We might want to pass unpaid invoices as well to populate a dropdown initially or handle it via AJAX
        // For now, let's just pass customers and let the UI handle invoice fetching via a separate API endpoint or assume we select customer first.
        // Actually, easiest is to load all UNPAID invoices.
        // invoiceModel.getAllInvoices() returns all. We might want to filter.
        // Let's just fetch all for now and filter in UI or improved query later.
        const invoices = await invoiceModel.getAllInvoices();
        const unpaidInvoices = invoices.filter(inv => inv.status !== 'PAID' && inv.status !== 'VOID');

        res.render('payments/receive-payment', {
            customers,
            invoices: unpaidInvoices,
            selectedInvoiceId: invoiceId
        });
    } catch (error) {
        console.error('Error rendering receive payment page:', error);
        req.flash('error_msg', 'Error loading page');
        res.redirect('/admin/dashboard');
    }
};

// Handle Receive Payment Submission
const receivePayment = async (req, res) => {
    try {
        const { invoiceId, amount, paymentDate, paymentMethod, reference, notes } = req.body;

        const invoice = await invoiceModel.getInvoiceById(invoiceId);
        if (!invoice) {
            req.flash('error_msg', 'Invoice not found');
            return res.redirect('/payments/receive');
        }

        const paymentAmount = parseFloat(amount);

        if (paymentAmount <= 0) {
            req.flash('error_msg', 'Payment amount must be greater than 0');
            return res.redirect('/payments/receive');
        }

        // Validation: Check for overpayment
        const currentTotalPaid = parseFloat((await paymentModel.getTotalPaidForInvoice(invoiceId))) || 0;
        const invoiceTotal = parseFloat(invoice.total_amount);
        const remainingBalance = invoiceTotal - currentTotalPaid;

        if (paymentAmount > remainingBalance + 0.01) { // Tolerance
            req.flash('error_msg', `Payment amount (₦${paymentAmount}) exceeds remaining balance (₦${remainingBalance.toFixed(2)})`);
            return res.redirect('/payments/receive');
        }

        // 1. Create Payment Record
        await paymentModel.createPayment({
            invoiceId,
            amount: paymentAmount,
            paymentDate,
            paymentMethod,
            reference,
            notes
        });

        // 2. Calculate New Status
        const totalPaid = parseFloat((await paymentModel.getTotalPaidForInvoice(invoiceId))) || 0;
        const totalAmount = parseFloat(invoice.total_amount);

        let newStatus = 'UNPAID';
        if (totalPaid >= totalAmount - 0.01) { // Floating point tolerance
            newStatus = 'PAID';
        } else if (totalPaid > 0) {
            newStatus = 'PARTIALLY_PAID';
        }

        // 3. Update Invoice Status
        await invoiceModel.updateInvoiceStatus(invoiceId, newStatus);

        // 4. Update Customer Balance (Decrease Receivable)
        // paymentAmount reduces the debt
        await customerModel.updateCustomerBalance(invoice.customer_id, -paymentAmount);

        // 5. Post to Ledger
        const ledgerEntry = {
            transactionId: `TXN-PAY-${invoiceId}-${Date.now()}`,
            transactionDate: paymentDate,
            transactionType: 'PAYMENT',
            referenceNumber: reference || `PAY-${invoice.invoice_number}`,
            description: `Payment for Invoice ${invoice.invoice_number}`,
            totalAmount: paymentAmount,
            createdBy: 'admin', // TODO: Session user
            entries: [
                {
                    accountCode: ACCOUNTS.CASH,
                    entryType: 'DEBIT',
                    amount: paymentAmount,
                    description: `Payment for INV ${invoice.invoice_number}`
                },
                {
                    accountCode: ACCOUNTS.RECEIVABLE,
                    entryType: 'CREDIT',
                    amount: paymentAmount,
                    description: `Payment for INV ${invoice.invoice_number}`
                }
            ]
        };

        await ledgerModel.insertTransaction(ledgerEntry);

        req.flash('success_msg', 'Payment received successfully');
        res.redirect('/payments/receive');

    } catch (error) {
        console.error('Error receiving payment:', error);
        req.flash('error_msg', 'Failed to receive payment: ' + error.message);
        res.redirect('/payments/receive');
    }
};

const renderPaymentList = async (req, res) => {
    try {
        const payments = await paymentModel.getAllPayments();
        res.render('payments/list', { payments });
    } catch (error) {
        console.error('Error fetching payments:', error);
        req.flash('error_msg', 'Error loading payments');
        res.redirect('/admin/dashboard');
    }
};

module.exports = {
    renderReceivePayment,
    receivePayment,
    renderPaymentList
};
