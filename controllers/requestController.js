const RequestModel = require('../models/requestModel');
const SalesRepModel = require('../models/salesRepModel');
const AdminModel = require('../models/adminModel');
const LedgerModel = require('../models/ledgerModel');

// Accountant Dashboard
const getAccountantDashboard = async (req, res) => {
    try {
        const requests = await RequestModel.getRequestsByStage('ACCOUNTANT');
        res.render('requests/accountant-dashboard', { requests, title: 'Accountant Approval', user: req.user });
    } catch (error) {
        console.error(error);
        res.render('error-page', { error });
    }
};

// Head of Ops Dashboard
const getOpsDashboard = async (req, res) => {
    try {
        const requests = await RequestModel.getRequestsByStage('OPS');
        res.render('requests/ops-dashboard', { requests, title: 'Operations Approval' });
    } catch (error) {
        console.error(error);
        res.render('error-page', { error });
    }
};

// Warehouse Dashboard
const getWarehouseDashboard = async (req, res) => {
    try {
        const requests = await RequestModel.getRequestsByStage('WAREHOUSE');
        res.render('requests/warehouse-dashboard', { requests, title: 'Warehouse Issue' });
    } catch (error) {
        console.error(error);
        res.render('error-page', { error });
    }
};

// Warehouse Products
const getWarehouseProducts = async (req, res) => {
    try {
        const products = await AdminModel.getProducts();
        res.render('requests/warehouse-products', { products, title: 'All Products', user: req.user });
    } catch (error) {
        console.error('Error fetching products for warehouse:', error);
        res.render('error-page', { error });
    }
};

// Operations Products
const getOpsProducts = async (req, res) => {
    try {
        const products = await AdminModel.getProducts();
        res.render('requests/ops-products', { products, title: 'All Products', user: req.user });
    } catch (error) {
        console.error('Error fetching products for operations:', error);
        res.render('error-page', { error });
    }
};

// Handle Approvals
const handleApproval = async (req, res) => {
    const { id } = req.params;
    const { stage } = req.body; // 'accountant', 'ops', 'warehouse'

    try {
        const request = await RequestModel.getRequestById(id);
        if (!request) {
            req.flash('error_msg', 'Request not found');
            const redirectMap = {
                'accountant': '/accountant/dashboard',
                'ops': '/operations/dashboard',
                'warehouse': '/warehouse/dashboard'
            };
            return res.redirect(redirectMap[stage] || '/');
        }

        let updates = {};
        const redirectMap = {
            'accountant': '/accountant/dashboard',
            'ops': '/operations/dashboard',
            'warehouse': '/warehouse/dashboard'
        };
        let redirectUrl = redirectMap[stage] || '/';

        if (stage === 'accountant') {
            updates = {
                accountant_status: 'APPROVED',
                accountant_approval_date: new Date(),
                current_stage: 'OPS'
            };
            redirectUrl = '/accountant/dashboard';
        } else if (stage === 'ops') {
            updates = {
                ops_status: 'APPROVED',
                ops_approval_date: new Date(),
                current_stage: 'WAREHOUSE'
            };
            redirectUrl = '/operations/dashboard';
        } else if (stage === 'warehouse') {
            updates = {
                warehouse_status: 'ISSUED',
                warehouse_issue_date: new Date(),
                current_stage: 'COMPLETED',
                status: 'APPROVED' // Final status for legacy compatibility
            };
            // Update debt only when issued? Or when approved initially? 
            // Previous logic was on approval. Let's keep it consistent.
            // If we update debt here, we ensure they only owe for what they GOT.
            await SalesRepModel.updateDebt(request.sales_rep_id, request.total_amount);

            redirectUrl = '/warehouse/dashboard';
        }

        await RequestModel.updateStageStatus(id, updates);
        req.flash('success_msg', 'Request processed successfully');
        res.redirect(redirectUrl);

    } catch (error) {
        console.error(error);
        req.flash('error_msg', 'Error processing request');
        const redirectMap = {
            'accountant': '/accountant/dashboard',
            'ops': '/operations/dashboard',
            'warehouse': '/warehouse/dashboard'
        };
        res.redirect(redirectMap[req.body.stage] || '/');
    }
};

// Handle Rejection
const handleRejection = async (req, res) => {
    const { id } = req.params;
    const { stage, reason } = req.body;

    try {
        let updates = {
            status: 'DECLINED', // Final status
            current_stage: 'REJECTED',
            rejection_reason: reason || 'Declined without reason'
        };

        if (stage === 'accountant') {
            updates.accountant_status = 'REJECTED';
            updates.accountant_approval_date = new Date();
        } else if (stage === 'ops') {
            updates.ops_status = 'REJECTED';
            updates.ops_approval_date = new Date();
        } else if (stage === 'warehouse') {
            updates.warehouse_status = 'REJECTED';
            updates.warehouse_issue_date = new Date();
        }

        await RequestModel.updateStageStatus(id, updates);
        req.flash('success_msg', 'Request declined');
        const redirectMap = {
            'accountant': '/accountant/dashboard',
            'ops': '/operations/dashboard',
            'warehouse': '/warehouse/dashboard'
        };
        res.redirect(redirectMap[stage] || '/');

    } catch (error) {
        console.error(error);
        req.flash('error_msg', 'Error declining request');
        const redirectMap = {
            'accountant': '/accountant/dashboard',
            'ops': '/operations/dashboard',
            'warehouse': '/warehouse/dashboard'
        };
        res.redirect(redirectMap[req.body.stage] || '/');
    }
};

// Generic helper for email validation
const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

// --- ACCOUNTANT MANAGEMENT METHODS ---

const getAccountantSalesReps = async (req, res) => {
    try {
        const salesReps = await SalesRepModel.getAllSalesReps();
        res.render('requests/accountant-sales-reps', { salesReps, title: 'Manage Sales Reps', user: req.user });
    } catch (error) {
        console.error(error);
        res.render('error-page');
    }
};

const getAccountantAddSalesRep = (req, res) => {
    res.render('requests/accountant-add-sales-rep', { title: 'Add Sales Rep', user: req.user });
};

const postAccountantAddSalesRep = async (req, res) => {
    const { name, email, phone } = req.body;
    try {
        if (!isValidEmail(email)) {
            req.flash('error_msg', 'Invalid email address');
            return res.redirect('/accountant/sales-reps/add');
        }
        const uniqueId = 'REP-' + Math.floor(1000 + Math.random() * 9000);
        await SalesRepModel.createSalesRep({ name, email, phone, uniqueId });
        req.flash('success_msg', `Sales Rep added successfully. Unique ID: ${uniqueId}`);
        res.redirect('/accountant/sales-reps');
    } catch (error) {
        console.error(error);
        req.flash('error_msg', 'Error adding sales rep');
        res.redirect('/accountant/sales-reps/add');
    }
};

const getAccountantEditSalesRep = async (req, res) => {
    try {
        const salesRep = await SalesRepModel.getSalesRepById(req.params.id);
        if (!salesRep) {
            req.flash('error_msg', 'Sales Representative not found');
            return res.redirect('/accountant/sales-reps');
        }
        res.render('requests/accountant-edit-sales-rep', { salesRep, title: 'Edit Sales Rep', user: req.user });
    } catch (error) {
        console.error(error);
        res.render('error-page');
    }
};

const postAccountantUpdateSalesRep = async (req, res) => {
    const { id } = req.params;
    const { name, email, phone } = req.body;
    try {
        if (!isValidEmail(email)) {
            req.flash('error_msg', 'Invalid email address');
            return res.redirect(`/accountant/sales-reps/${id}/edit`);
        }
        await SalesRepModel.updateSalesRep(id, { name, email, phone });
        req.flash('success_msg', 'Sales Representative updated successfully');
        res.redirect('/accountant/sales-reps');
    } catch (error) {
        console.error(error);
        req.flash('error_msg', 'Error updating sales representative');
        res.redirect(`/accountant/sales-reps/${id}/edit`);
    }
};

const postAccountantDeleteSalesRep = async (req, res) => {
    const { id } = req.params;
    try {
        await SalesRepModel.deleteSalesRep(id);
        req.flash('success_msg', 'Sales Representative deleted successfully');
        res.redirect('/accountant/sales-reps');
    } catch (error) {
        console.error(error);
        req.flash('error_msg', 'Error deleting sales representative');
        res.redirect('/accountant/sales-reps');
    }
};

const getAccountantSalesRepPayment = async (req, res) => {
    try {
        const { id } = req.params;
        const salesReps = await SalesRepModel.getAllSalesReps();
        const rep = salesReps.find(r => r.id == id);
        if (!rep) {
            req.flash('error_msg', 'Sales Rep not found');
            return res.redirect('/accountant/sales-reps');
        }
        res.render('requests/accountant-sales-rep-payment', { rep, title: 'Record Rep Payment', user: req.user });
    } catch (error) {
        console.error(error);
        res.render('error-page');
    }
};

const postAccountantHandleSalesRepPayment = async (req, res) => {
    try {
        const { id } = req.params;
        const { amount, paymentDate, paymentMethod, reference, notes } = req.body;
        const salesReps = await SalesRepModel.getAllSalesReps();
        const rep = salesReps.find(r => r.id == id);
        if (!rep) {
            req.flash('error_msg', 'Sales Rep not found');
            return res.redirect('/accountant/sales-reps');
        }
        if (parseFloat(amount) <= 0 || parseFloat(amount) > parseFloat(rep.debt)) {
            req.flash('error_msg', 'Invalid payment amount');
            return res.redirect(`/accountant/sales-reps/${id}/payment`);
        }
        await SalesRepModel.recordPayment({ salesRepId: id, amount, paymentDate, paymentMethod, reference, notes });
        await LedgerModel.insertTransaction({
            transactionId: `TXN-REP-PAY-${id}-${Date.now()}`,
            transactionDate: paymentDate,
            transactionType: 'PAYMENT',
            referenceNumber: reference || `REP-PAY-${id}`,
            description: `Payment from Sales Rep: ${rep.name}`,
            totalAmount: amount,
            createdBy: 'accountant',
            entries: [
                { accountCode: '1000', entryType: 'DEBIT', amount: amount, description: `Rep ${rep.name} payment` },
                { accountCode: '1200', entryType: 'CREDIT', amount: amount, description: `Rep ${rep.name} payment` }
            ]
        });
        req.flash('success_msg', 'Payment recorded successfully');
        res.redirect('/accountant/sales-reps');
    } catch (error) {
        console.error(error);
        req.flash('error_msg', 'Error recording payment');
        res.redirect('/accountant/sales-reps');
    }
};

const getAccountantSalesRepInvoices = async (req, res) => {
    try {
        const invoices = await SalesRepModel.getAllSalesRepInvoices();
        res.render('requests/accountant-sales-rep-invoices', { invoices, title: 'Sales Rep Invoices', user: req.user });
    } catch (error) {
        console.error(error);
        res.redirect('/accountant/dashboard');
    }
};

const getAccountantCreateSalesRepInvoice = async (req, res) => {
    try {
        const salesReps = await SalesRepModel.getAllSalesReps();
        const products = await AdminModel.getProducts();
        res.render('requests/accountant-create-sales-rep-invoice', { salesReps, products, title: 'Create Invoice', user: req.user });
    } catch (error) {
        console.error(error);
        res.redirect('/accountant/sales-rep-invoices');
    }
};

const postAccountantCreateSalesRepInvoice = async (req, res) => {
    try {
        const { salesRepId, invoiceDate, dueDate, items } = req.body;
        let parsedItems = typeof items === 'string' ? JSON.parse(items) : items;
        const totalAmount = parsedItems.reduce((sum, item) => sum + parseFloat(item.total), 0);
        const invoiceNumber = `SREP-INV-${Date.now()}`;
        const result = await SalesRepModel.createSalesRepInvoice({ invoiceNumber, salesRepId, invoiceDate, dueDate, totalAmount, reference: `Invoice for Rep #${salesRepId}` }, parsedItems);
        await SalesRepModel.updateDebt(salesRepId, totalAmount);
        await LedgerModel.insertTransaction({
            transactionId: `TXN-SREP-INV-${result.invoiceId}`,
            transactionDate: invoiceDate,
            transactionType: 'INVOICE',
            referenceNumber: invoiceNumber,
            description: `Rep Invoice ${invoiceNumber}`,
            totalAmount: totalAmount,
            createdBy: 'accountant',
            entries: [
                { accountCode: '1200', entryType: 'DEBIT', amount: totalAmount, description: `Rep Invoice ${invoiceNumber}` },
                { accountCode: '4000', entryType: 'CREDIT', amount: totalAmount, description: `Rep Invoice ${invoiceNumber}` }
            ]
        });
        req.flash('success_msg', 'Invoice created successfully');
        res.redirect('/accountant/sales-rep-invoices');
    } catch (error) {
        console.error(error);
        res.redirect('/accountant/sales-rep-invoices/create');
    }
};

const getAccountantSalesRepInvoiceDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const invoice = await SalesRepModel.getSalesRepInvoiceById(id);
        const totalPaid = await SalesRepModel.getInvoiceTotalPaid(id);
        const balance = parseFloat(invoice.total_amount) - parseFloat(totalPaid);
        const payments = await SalesRepModel.getInvoicePayments(id);
        res.render('requests/accountant-sales-rep-invoice-details', { invoice, totalPaid, balance, payments, title: 'Invoice Details', user: req.user });
    } catch (error) {
        console.error(error);
        res.redirect('/accountant/sales-rep-invoices');
    }
};

const getAccountantSalesRepInvoicePayment = async (req, res) => {
    try {
        const { id } = req.params;
        const invoice = await SalesRepModel.getSalesRepInvoiceById(id);
        const totalPaid = await SalesRepModel.getInvoiceTotalPaid(id);
        const balance = parseFloat(invoice.total_amount) - parseFloat(totalPaid);
        const payments = await SalesRepModel.getInvoicePayments(id);
        res.render('requests/accountant-sales-rep-invoice-payment', { invoice, totalPaid, balance, payments, title: 'Record Invoice Payment', user: req.user });
    } catch (error) {
        console.error(error);
        res.redirect('/accountant/sales-rep-invoices');
    }
};

const postAccountantRecordSalesRepInvoicePayment = async (req, res) => {
    try {
        const { id } = req.params;
        const { amount, paymentDate, paymentMethod, reference, notes } = req.body;
        const invoice = await SalesRepModel.getSalesRepInvoiceById(id);
        const paymentAmount = parseFloat(amount);
        await SalesRepModel.recordInvoicePayment({ invoiceId: id, amount: paymentAmount, paymentDate, paymentMethod, reference, notes });
        await SalesRepModel.updateDebt(invoice.sales_rep_id, -paymentAmount);
        const totalPaid = await SalesRepModel.getInvoiceTotalPaid(id);
        if (parseFloat(totalPaid) >= parseFloat(invoice.total_amount)) await SalesRepModel.updateSalesRepInvoiceStatus(id, 'PAID');
        else if (parseFloat(totalPaid) > 0) await SalesRepModel.updateSalesRepInvoiceStatus(id, 'PARTIALLY_PAID');
        await LedgerModel.insertTransaction({
            transactionId: `TXN-SREP-PAY-${id}-${Date.now()}`,
            transactionDate: paymentDate,
            transactionType: 'PAYMENT',
            referenceNumber: invoice.invoice_number,
            description: `Payment for Rep Invoice ${invoice.invoice_number}`,
            totalAmount: paymentAmount,
            createdBy: 'accountant',
            entries: [
                { accountCode: '1000', entryType: 'DEBIT', amount: paymentAmount, description: `Rep Inv ${invoice.invoice_number}` },
                { accountCode: '1200', entryType: 'CREDIT', amount: paymentAmount, description: `Rep Inv ${invoice.invoice_number}` }
            ]
        });
        req.flash('success_msg', 'Payment recorded successfully');
        res.redirect(`/accountant/sales-rep-invoices/${id}`);
    } catch (error) {
        console.error(error);
        res.redirect('/accountant/sales-rep-invoices');
    }
};

// --- OPERATIONS MANAGEMENT METHODS (Mirroring Accountant) ---

const getOpsSalesReps = async (req, res) => {
    try {
        const salesReps = await SalesRepModel.getAllSalesReps();
        res.render('requests/ops-sales-reps', { salesReps, title: 'Manage Sales Reps' });
    } catch (error) { console.error(error); res.render('error-page'); }
};

const getOpsAddSalesRep = (req, res) => res.render('requests/ops-add-sales-rep', { title: 'Add Sales Rep' });

const postOpsAddSalesRep = async (req, res) => {
    const { name, email, phone } = req.body;
    try {
        if (!isValidEmail(email)) { req.flash('error_msg', 'Invalid email address'); return res.redirect('/operations/sales-reps/add'); }
        const uniqueId = 'REP-' + Math.floor(1000 + Math.random() * 9000);
        await SalesRepModel.createSalesRep({ name, email, phone, uniqueId });
        req.flash('success_msg', `Sales Rep added successfully. Unique ID: ${uniqueId}`);
        res.redirect('/operations/sales-reps');
    } catch (error) { console.error(error); req.flash('error_msg', 'Error adding sales rep'); res.redirect('/operations/sales-reps/add'); }
};

const getOpsEditSalesRep = async (req, res) => {
    try {
        const salesRep = await SalesRepModel.getSalesRepById(req.params.id);
        if (!salesRep) { req.flash('error_msg', 'Sales Representative not found'); return res.redirect('/operations/sales-reps'); }
        res.render('requests/ops-edit-sales-rep', { salesRep, title: 'Edit Sales Rep' });
    } catch (error) { console.error(error); res.render('error-page'); }
};

const postOpsUpdateSalesRep = async (req, res) => {
    const { id } = req.params;
    const { name, email, phone } = req.body;
    try {
        if (!isValidEmail(email)) { req.flash('error_msg', 'Invalid email address'); return res.redirect(`/operations/sales-reps/${id}/edit`); }
        await SalesRepModel.updateSalesRep(id, { name, email, phone });
        req.flash('success_msg', 'Sales Representative updated successfully');
        res.redirect('/operations/sales-reps');
    } catch (error) { console.error(error); req.flash('error_msg', 'Error updating sales representative'); res.redirect(`/operations/sales-reps/${id}/edit`); }
};

const postOpsDeleteSalesRep = async (req, res) => {
    const { id } = req.params;
    try {
        await SalesRepModel.deleteSalesRep(id);
        req.flash('success_msg', 'Sales Representative deleted successfully');
        res.redirect('/operations/sales-reps');
    } catch (error) { console.error(error); req.flash('error_msg', 'Error deleting sales representative'); res.redirect('/operations/sales-reps'); }
};

const getOpsSalesRepPayment = async (req, res) => {
    try {
        const { id } = req.params;
        const salesReps = await SalesRepModel.getAllSalesReps();
        const rep = salesReps.find(r => r.id == id);
        if (!rep) { req.flash('error_msg', 'Sales Rep not found'); return res.redirect('/operations/sales-reps'); }
        res.render('requests/ops-sales-rep-payment', { rep, title: 'Record Rep Payment' });
    } catch (error) { console.error(error); res.render('error-page'); }
};

const postOpsHandleSalesRepPayment = async (req, res) => {
    try {
        const { id } = req.params;
        const { amount, paymentDate, paymentMethod, reference, notes } = req.body;
        const salesReps = await SalesRepModel.getAllSalesReps();
        const rep = salesReps.find(r => r.id == id);
        if (!rep) { req.flash('error_msg', 'Sales Rep not found'); return res.redirect('/operations/sales-reps'); }
        if (parseFloat(amount) <= 0 || parseFloat(amount) > parseFloat(rep.debt)) { req.flash('error_msg', 'Invalid payment amount'); return res.redirect(`/operations/sales-reps/${id}/payment`); }
        await SalesRepModel.recordPayment({ salesRepId: id, amount, paymentDate, paymentMethod, reference, notes });
        await LedgerModel.insertTransaction({
            transactionId: `TXN-REP-PAY-${id}-${Date.now()}`,
            transactionDate: paymentDate,
            transactionType: 'PAYMENT',
            referenceNumber: reference || `REP-PAY-${id}`,
            description: `Payment from Sales Rep: ${rep.name}`,
            totalAmount: amount,
            createdBy: 'ops',
            entries: [
                { accountCode: '1000', entryType: 'DEBIT', amount: amount, description: `Rep ${rep.name} payment` },
                { accountCode: '1200', entryType: 'CREDIT', amount: amount, description: `Rep ${rep.name} payment` }
            ]
        });
        req.flash('success_msg', 'Payment recorded successfully');
        res.redirect('/operations/sales-reps');
    } catch (error) { console.error(error); req.flash('error_msg', 'Error recording payment'); res.redirect('/operations/sales-reps'); }
};

const getOpsSalesRepInvoices = async (req, res) => {
    try {
        const invoices = await SalesRepModel.getAllSalesRepInvoices();
        res.render('requests/ops-sales-rep-invoices', { invoices, title: 'Sales Rep Invoices' });
    } catch (error) { console.error(error); res.redirect('/operations/dashboard'); }
};

const getOpsCreateSalesRepInvoice = async (req, res) => {
    try {
        const salesReps = await SalesRepModel.getAllSalesReps();
        const products = await AdminModel.getProducts();
        res.render('requests/ops-create-sales-rep-invoice', { salesReps, products, title: 'Create Invoice' });
    } catch (error) { console.error(error); res.redirect('/operations/sales-rep-invoices'); }
};

const postOpsCreateSalesRepInvoice = async (req, res) => {
    try {
        const { salesRepId, invoiceDate, dueDate, items } = req.body;
        let parsedItems = typeof items === 'string' ? JSON.parse(items) : items;
        const totalAmount = parsedItems.reduce((sum, item) => sum + parseFloat(item.total), 0);
        const invoiceNumber = `SREP-INV-${Date.now()}`;
        const result = await SalesRepModel.createSalesRepInvoice({ invoiceNumber, salesRepId, invoiceDate, dueDate, totalAmount, reference: `Invoice for Rep #${salesRepId}` }, parsedItems);
        await SalesRepModel.updateDebt(salesRepId, totalAmount);
        await LedgerModel.insertTransaction({
            transactionId: `TXN-SREP-INV-${result.invoiceId}`,
            transactionDate: invoiceDate,
            transactionType: 'INVOICE',
            referenceNumber: invoiceNumber,
            description: `Rep Invoice ${invoiceNumber}`,
            totalAmount: totalAmount,
            createdBy: 'ops',
            entries: [
                { accountCode: '1200', entryType: 'DEBIT', amount: totalAmount, description: `Rep Invoice ${invoiceNumber}` },
                { accountCode: '4000', entryType: 'CREDIT', amount: totalAmount, description: `Rep Invoice ${invoiceNumber}` }
            ]
        });
        req.flash('success_msg', 'Invoice created successfully');
        res.redirect('/operations/sales-rep-invoices');
    } catch (error) { console.error(error); res.redirect('/operations/sales-rep-invoices/create'); }
};

const getOpsSalesRepInvoiceDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const invoice = await SalesRepModel.getSalesRepInvoiceById(id);
        const totalPaid = await SalesRepModel.getInvoiceTotalPaid(id);
        const balance = parseFloat(invoice.total_amount) - parseFloat(totalPaid);
        const payments = await SalesRepModel.getInvoicePayments(id);
        res.render('requests/ops-sales-rep-invoice-details', { invoice, totalPaid, balance, payments, title: 'Invoice Details' });
    } catch (error) { console.error(error); res.redirect('/operations/sales-rep-invoices'); }
};

const getOpsSalesRepInvoicePayment = async (req, res) => {
    try {
        const { id } = req.params;
        const invoice = await SalesRepModel.getSalesRepInvoiceById(id);
        const totalPaid = await SalesRepModel.getInvoiceTotalPaid(id);
        const balance = parseFloat(invoice.total_amount) - parseFloat(totalPaid);
        const payments = await SalesRepModel.getInvoicePayments(id);
        res.render('requests/ops-sales-rep-invoice-payment', { invoice, totalPaid, balance, payments, title: 'Record Invoice Payment' });
    } catch (error) { console.error(error); res.redirect('/operations/sales-rep-invoices'); }
};

const postOpsRecordSalesRepInvoicePayment = async (req, res) => {
    try {
        const { id } = req.params;
        const { amount, paymentDate, paymentMethod, reference, notes } = req.body;
        const invoice = await SalesRepModel.getSalesRepInvoiceById(id);
        const paymentAmount = parseFloat(amount);
        await SalesRepModel.recordInvoicePayment({ invoiceId: id, amount: paymentAmount, paymentDate, paymentMethod, reference, notes });
        await SalesRepModel.updateDebt(invoice.sales_rep_id, -paymentAmount);
        const totalPaid = await SalesRepModel.getInvoiceTotalPaid(id);
        if (parseFloat(totalPaid) >= parseFloat(invoice.total_amount)) await SalesRepModel.updateSalesRepInvoiceStatus(id, 'PAID');
        else if (parseFloat(totalPaid) > 0) await SalesRepModel.updateSalesRepInvoiceStatus(id, 'PARTIALLY_PAID');
        await LedgerModel.insertTransaction({
            transactionId: `TXN-SREP-PAY-${id}-${Date.now()}`,
            transactionDate: paymentDate,
            transactionType: 'PAYMENT',
            referenceNumber: invoice.invoice_number,
            description: `Payment for Rep Invoice ${invoice.invoice_number}`,
            totalAmount: paymentAmount,
            createdBy: 'ops',
            entries: [
                { accountCode: '1000', entryType: 'DEBIT', amount: paymentAmount, description: `Rep Inv ${invoice.invoice_number}` },
                { accountCode: '1200', entryType: 'CREDIT', amount: paymentAmount, description: `Rep Inv ${invoice.invoice_number}` }
            ]
        });
        req.flash('success_msg', 'Payment recorded successfully');
        res.redirect(`/operations/sales-rep-invoices/${id}`);
    } catch (error) { console.error(error); res.redirect('/operations/sales-rep-invoices'); }
};

// --- WAREHOUSE MANAGEMENT METHODS (Mirroring Accountant) ---

const getWarehouseSalesReps = async (req, res) => {
    try {
        const salesReps = await SalesRepModel.getAllSalesReps();
        res.render('requests/warehouse-sales-reps', { salesReps, title: 'Manage Sales Reps' });
    } catch (error) { console.error(error); res.render('error-page'); }
};

const getWarehouseAddSalesRep = (req, res) => res.render('requests/warehouse-add-sales-rep', { title: 'Add Sales Rep' });

const postWarehouseAddSalesRep = async (req, res) => {
    const { name, email, phone } = req.body;
    try {
        if (!isValidEmail(email)) { req.flash('error_msg', 'Invalid email address'); return res.redirect('/warehouse/sales-reps/add'); }
        const uniqueId = 'REP-' + Math.floor(1000 + Math.random() * 9000);
        await SalesRepModel.createSalesRep({ name, email, phone, uniqueId });
        req.flash('success_msg', `Sales Rep added successfully. Unique ID: ${uniqueId}`);
        res.redirect('/warehouse/sales-reps');
    } catch (error) { console.error(error); req.flash('error_msg', 'Error adding sales rep'); res.redirect('/warehouse/sales-reps/add'); }
};

const getWarehouseEditSalesRep = async (req, res) => {
    try {
        const salesRep = await SalesRepModel.getSalesRepById(req.params.id);
        if (!salesRep) { req.flash('error_msg', 'Sales Representative not found'); return res.redirect('/warehouse/sales-reps'); }
        res.render('requests/warehouse-edit-sales-rep', { salesRep, title: 'Edit Sales Rep' });
    } catch (error) { console.error(error); res.render('error-page'); }
};

const postWarehouseUpdateSalesRep = async (req, res) => {
    const { id } = req.params;
    const { name, email, phone } = req.body;
    try {
        if (!isValidEmail(email)) { req.flash('error_msg', 'Invalid email address'); return res.redirect(`/warehouse/sales-reps/${id}/edit`); }
        await SalesRepModel.updateSalesRep(id, { name, email, phone });
        req.flash('success_msg', 'Sales Representative updated successfully');
        res.redirect('/warehouse/sales-reps');
    } catch (error) { console.error(error); req.flash('error_msg', 'Error updating sales representative'); res.redirect(`/warehouse/sales-reps/${id}/edit`); }
};

const postWarehouseDeleteSalesRep = async (req, res) => {
    const { id } = req.params;
    try {
        await SalesRepModel.deleteSalesRep(id);
        req.flash('success_msg', 'Sales Representative deleted successfully');
        res.redirect('/warehouse/sales-reps');
    } catch (error) { console.error(error); req.flash('error_msg', 'Error deleting sales representative'); res.redirect('/warehouse/sales-reps'); }
};

const getWarehouseSalesRepPayment = async (req, res) => {
    try {
        const { id } = req.params;
        const salesReps = await SalesRepModel.getAllSalesReps();
        const rep = salesReps.find(r => r.id == id);
        if (!rep) { req.flash('error_msg', 'Sales Rep not found'); return res.redirect('/warehouse/sales-reps'); }
        res.render('requests/warehouse-sales-rep-payment', { rep, title: 'Record Rep Payment' });
    } catch (error) { console.error(error); res.render('error-page'); }
};

const postWarehouseHandleSalesRepPayment = async (req, res) => {
    try {
        const { id } = req.params;
        const { amount, paymentDate, paymentMethod, reference, notes } = req.body;
        const salesReps = await SalesRepModel.getAllSalesReps();
        const rep = salesReps.find(r => r.id == id);
        if (!rep) { req.flash('error_msg', 'Sales Rep not found'); return res.redirect('/warehouse/sales-reps'); }
        if (parseFloat(amount) <= 0 || parseFloat(amount) > parseFloat(rep.debt)) { req.flash('error_msg', 'Invalid payment amount'); return res.redirect(`/warehouse/sales-reps/${id}/payment`); }
        await SalesRepModel.recordPayment({ salesRepId: id, amount, paymentDate, paymentMethod, reference, notes });
        await LedgerModel.insertTransaction({
            transactionId: `TXN-REP-PAY-${id}-${Date.now()}`,
            transactionDate: paymentDate,
            transactionType: 'PAYMENT',
            referenceNumber: reference || `REP-PAY-${id}`,
            description: `Payment from Sales Rep: ${rep.name}`,
            totalAmount: amount,
            createdBy: 'warehouse',
            entries: [
                { accountCode: '1000', entryType: 'DEBIT', amount: amount, description: `Rep ${rep.name} payment` },
                { accountCode: '1200', entryType: 'CREDIT', amount: amount, description: `Rep ${rep.name} payment` }
            ]
        });
        req.flash('success_msg', 'Payment recorded successfully');
        res.redirect('/warehouse/sales-reps');
    } catch (error) { console.error(error); req.flash('error_msg', 'Error recording payment'); res.redirect('/warehouse/sales-reps'); }
};

const getWarehouseSalesRepInvoices = async (req, res) => {
    try {
        const invoices = await SalesRepModel.getAllSalesRepInvoices();
        res.render('requests/warehouse-sales-rep-invoices', { invoices, title: 'Sales Rep Invoices' });
    } catch (error) { console.error(error); res.redirect('/warehouse/dashboard'); }
};

const getWarehouseCreateSalesRepInvoice = async (req, res) => {
    try {
        const salesReps = await SalesRepModel.getAllSalesReps();
        const products = await AdminModel.getProducts();
        res.render('requests/warehouse-create-sales-rep-invoice', { salesReps, products, title: 'Create Invoice' });
    } catch (error) { console.error(error); res.redirect('/warehouse/sales-rep-invoices'); }
};

const postWarehouseCreateSalesRepInvoice = async (req, res) => {
    try {
        const { salesRepId, invoiceDate, dueDate, items } = req.body;
        let parsedItems = typeof items === 'string' ? JSON.parse(items) : items;
        const totalAmount = parsedItems.reduce((sum, item) => sum + parseFloat(item.total), 0);
        const invoiceNumber = `SREP-INV-${Date.now()}`;
        const result = await SalesRepModel.createSalesRepInvoice({ invoiceNumber, salesRepId, invoiceDate, dueDate, totalAmount, reference: `Invoice for Rep #${salesRepId}` }, parsedItems);
        await SalesRepModel.updateDebt(salesRepId, totalAmount);
        await LedgerModel.insertTransaction({
            transactionId: `TXN-SREP-INV-${result.invoiceId}`,
            transactionDate: invoiceDate,
            transactionType: 'INVOICE',
            referenceNumber: invoiceNumber,
            description: `Rep Invoice ${invoiceNumber}`,
            totalAmount: totalAmount,
            createdBy: 'warehouse',
            entries: [
                { accountCode: '1200', entryType: 'DEBIT', amount: totalAmount, description: `Rep Invoice ${invoiceNumber}` },
                { accountCode: '4000', entryType: 'CREDIT', amount: totalAmount, description: `Rep Invoice ${invoiceNumber}` }
            ]
        });
        req.flash('success_msg', 'Invoice created successfully');
        res.redirect('/warehouse/sales-rep-invoices');
    } catch (error) { console.error(error); res.redirect('/warehouse/sales-rep-invoices/create'); }
};

const getWarehouseSalesRepInvoiceDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const invoice = await SalesRepModel.getSalesRepInvoiceById(id);
        const totalPaid = await SalesRepModel.getInvoiceTotalPaid(id);
        const balance = parseFloat(invoice.total_amount) - parseFloat(totalPaid);
        const payments = await SalesRepModel.getInvoicePayments(id);
        res.render('requests/warehouse-sales-rep-invoice-details', { invoice, totalPaid, balance, payments, title: 'Invoice Details' });
    } catch (error) { console.error(error); res.redirect('/warehouse/sales-rep-invoices'); }
};

const getWarehouseSalesRepInvoicePayment = async (req, res) => {
    try {
        const { id } = req.params;
        const invoice = await SalesRepModel.getSalesRepInvoiceById(id);
        const totalPaid = await SalesRepModel.getInvoiceTotalPaid(id);
        const balance = parseFloat(invoice.total_amount) - parseFloat(totalPaid);
        const payments = await SalesRepModel.getInvoicePayments(id);
        res.render('requests/warehouse-sales-rep-invoice-payment', { invoice, totalPaid, balance, payments, title: 'Record Invoice Payment' });
    } catch (error) { console.error(error); res.redirect('/warehouse/sales-rep-invoices'); }
};

const postWarehouseRecordSalesRepInvoicePayment = async (req, res) => {
    try {
        const { id } = req.params;
        const { amount, paymentDate, paymentMethod, reference, notes } = req.body;
        const invoice = await SalesRepModel.getSalesRepInvoiceById(id);
        const paymentAmount = parseFloat(amount);
        await SalesRepModel.recordInvoicePayment({ invoiceId: id, amount: paymentAmount, paymentDate, paymentMethod, reference, notes });
        await SalesRepModel.updateDebt(invoice.sales_rep_id, -paymentAmount);
        const totalPaid = await SalesRepModel.getInvoiceTotalPaid(id);
        if (parseFloat(totalPaid) >= parseFloat(invoice.total_amount)) await SalesRepModel.updateSalesRepInvoiceStatus(id, 'PAID');
        else if (parseFloat(totalPaid) > 0) await SalesRepModel.updateSalesRepInvoiceStatus(id, 'PARTIALLY_PAID');
        await LedgerModel.insertTransaction({
            transactionId: `TXN-SREP-PAY-${id}-${Date.now()}`,
            transactionDate: paymentDate,
            transactionType: 'PAYMENT',
            referenceNumber: invoice.invoice_number,
            description: `Payment for Rep Invoice ${invoice.invoice_number}`,
            totalAmount: paymentAmount,
            createdBy: 'warehouse',
            entries: [
                { accountCode: '1000', entryType: 'DEBIT', amount: paymentAmount, description: `Rep Inv ${invoice.invoice_number}` },
                { accountCode: '1200', entryType: 'CREDIT', amount: paymentAmount, description: `Rep Inv ${invoice.invoice_number}` }
            ]
        });
        req.flash('success_msg', 'Payment recorded successfully');
        res.redirect(`/warehouse/sales-rep-invoices/${id}`);
    } catch (error) { console.error(error); res.redirect('/warehouse/sales-rep-invoices'); }
};

module.exports = {
    getAccountantDashboard,
    getOpsDashboard,
    getWarehouseDashboard,
    handleApproval,
    handleRejection,
    getAccountantSalesReps,
    getAccountantAddSalesRep,
    postAccountantAddSalesRep,
    getAccountantEditSalesRep,
    postAccountantUpdateSalesRep,
    postAccountantDeleteSalesRep,
    getAccountantSalesRepPayment,
    postAccountantHandleSalesRepPayment,
    getAccountantSalesRepInvoices,
    getAccountantCreateSalesRepInvoice,
    postAccountantCreateSalesRepInvoice,
    getAccountantSalesRepInvoiceDetails,
    getAccountantSalesRepInvoicePayment,
    postAccountantRecordSalesRepInvoicePayment,
    getOpsSalesReps,
    getOpsAddSalesRep,
    postOpsAddSalesRep,
    getOpsEditSalesRep,
    postOpsUpdateSalesRep,
    postOpsDeleteSalesRep,
    getOpsSalesRepPayment,
    postOpsHandleSalesRepPayment,
    getOpsSalesRepInvoices,
    getOpsCreateSalesRepInvoice,
    postOpsCreateSalesRepInvoice,
    getOpsSalesRepInvoiceDetails,
    getOpsSalesRepInvoicePayment,
    postOpsRecordSalesRepInvoicePayment,
    getWarehouseSalesReps,
    getWarehouseAddSalesRep,
    postWarehouseAddSalesRep,
    getWarehouseEditSalesRep,
    postWarehouseUpdateSalesRep,
    postWarehouseDeleteSalesRep,
    getWarehouseSalesRepPayment,
    postWarehouseHandleSalesRepPayment,
    getWarehouseSalesRepInvoices,
    getWarehouseCreateSalesRepInvoice,
    postWarehouseCreateSalesRepInvoice,
    getWarehouseSalesRepInvoiceDetails,
    getWarehouseSalesRepInvoicePayment,
    postWarehouseRecordSalesRepInvoicePayment,
    getWarehouseProducts,
    getOpsProducts
};
