const db = require('../config/dbConfig');

// Create new payment
const createPayment = async (paymentData) => {
    return new Promise((resolve, reject) => {
        const { invoiceId, amount, paymentDate, paymentMethod, reference, notes } = paymentData;

        const query = `
            INSERT INTO payments (invoice_id, amount, payment_date, payment_method, reference, notes) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        db.query(
            query,
            [invoiceId, amount, paymentDate, paymentMethod, reference, notes],
            (err, result) => {
                if (err) return reject(err);
                resolve({ paymentId: result.insertId, ...paymentData });
            }
        );
    });
};

// Get payments for an invoice
const getPaymentsByInvoiceId = async (invoiceId) => {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM payments WHERE invoice_id = ? ORDER BY payment_date DESC`;
        db.query(query, [invoiceId], (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

// Get total paid amount for an invoice
const getTotalPaidForInvoice = async (invoiceId) => {
    return new Promise((resolve, reject) => {
        const query = `SELECT SUM(amount) as total_paid FROM payments WHERE invoice_id = ?`;
        db.query(query, [invoiceId], (err, result) => {
            if (err) return reject(err);
            resolve(result[0].total_paid || 0);
        });
    });
};

// Get all payments with details
const getAllPayments = async () => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT p.*, i.invoice_number, c.name as customer_name 
            FROM payments p
            JOIN invoices i ON p.invoice_id = i.invoice_id
            JOIN customers c ON i.customer_id = c.customer_id
            ORDER BY p.payment_date DESC, p.created_at DESC
        `;
        db.query(query, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

module.exports = {
    createPayment,
    getPaymentsByInvoiceId,
    getTotalPaidForInvoice,
    getAllPayments
};
