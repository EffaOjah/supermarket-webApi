const db = require('../config/dbConfig');

// Record Payment from Sales Rep
const recordPayment = (paymentData) => {
    return new Promise((resolve, reject) => {
        const { salesRepId, amount, paymentDate, paymentMethod, reference, notes } = paymentData;

        db.beginTransaction((err) => {
            if (err) return reject(err);

            // 1. Insert Payment Record
            const query = `INSERT INTO sales_rep_payments (sales_rep_id, amount, payment_date, payment_method, reference, notes) VALUES (?, ?, ?, ?, ?, ?)`;
            db.query(query, [salesRepId, amount, paymentDate, paymentMethod, reference, notes], (err, result) => {
                if (err) return db.rollback(() => reject(err));

                // 2. Update Sales Rep Debt (Decrease)
                const updateQuery = `UPDATE sales_reps SET debt = debt - ? WHERE id = ?`;
                db.query(updateQuery, [amount, salesRepId], (err) => {
                    if (err) return db.rollback(() => reject(err));

                    db.commit((err) => {
                        if (err) return db.rollback(() => reject(err));
                        resolve(result);
                    });
                });
            });
        });
    });
};

// Get Payments for Sales Rep
const getPaymentsBySalesRep = (salesRepId) => {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM sales_rep_payments WHERE sales_rep_id = ? ORDER BY payment_date DESC`;
        db.query(query, [salesRepId], (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};


// Create new sales rep
const createSalesRep = (data) => {
    return new Promise((resolve, reject) => {
        const { name, email, phone, uniqueId } = data;
        const query = "INSERT INTO sales_reps (name, email, phone, unique_id) VALUES (?, ?, ?, ?)";
        db.query(query, [name, email, phone, uniqueId], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

// Find by Unique ID
const findByUniqueId = (uniqueId) => {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM sales_reps WHERE unique_id = ? AND is_deleted = 0";
        db.query(query, [uniqueId], (err, result) => {
            if (err) return reject(err);
            resolve(result[0]); // Return first match
        });
    });
};

// Get all sales reps
const getAllSalesReps = () => {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM sales_reps WHERE is_deleted = 0 ORDER BY created_at DESC";
        db.query(query, (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

// Update debt
const updateDebt = (id, amount) => {
    return new Promise((resolve, reject) => {
        const query = "UPDATE sales_reps SET debt = debt + ? WHERE id = ?";
        db.query(query, [amount, id], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

// Get Sales Rep by ID
const getSalesRepById = (id) => {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM sales_reps WHERE id = ? AND is_deleted = 0";
        db.query(query, [id], (err, result) => {
            if (err) return reject(err);
            resolve(result[0]);
        });
    });
};

// Update Sales Rep details
const updateSalesRep = (id, data) => {
    return new Promise((resolve, reject) => {
        const { name, email, phone } = data;
        const query = "UPDATE sales_reps SET name = ?, email = ?, phone = ? WHERE id = ?";
        db.query(query, [name, email, phone, id], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

// Delete Sales Rep (Soft Delete)
const deleteSalesRep = (id) => {
    return new Promise((resolve, reject) => {
        const query = "UPDATE sales_reps SET is_deleted = 1 WHERE id = ?";
        db.query(query, [id], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

// Get all sales rep invoices
const getAllSalesRepInvoices = async () => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT i.*, sr.name as sales_rep_name
            FROM sales_rep_invoices i 
            JOIN sales_reps sr ON i.sales_rep_id = sr.id 
            ORDER BY i.invoice_date DESC
        `;
        db.query(query, (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
};

// Get sales rep invoice by ID
const getSalesRepInvoiceById = async (invoiceId) => {
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM sales_rep_invoices WHERE invoice_id = ?", [invoiceId], (err, invoice) => {
            if (err) return reject(err);
            if (!invoice || invoice.length === 0) return resolve(null);

            // Get items
            db.query("SELECT * FROM sales_rep_invoice_items WHERE invoice_id = ?", [invoiceId], (err, items) => {
                if (err) return reject(err);

                // Get sales rep details
                db.query("SELECT * FROM sales_reps WHERE id = ?", [invoice[0].sales_rep_id], (err, salesRep) => {
                    if (err) return reject(err);

                    resolve({
                        ...invoice[0],
                        items: items,
                        salesRep: salesRep[0]
                    });
                });
            });
        });
    });
};

// Create new sales rep invoice
const createSalesRepInvoice = async (invoiceData, items) => {
    return new Promise((resolve, reject) => {
        db.beginTransaction((err) => {
            if (err) return reject(err);

            const { invoiceNumber, salesRepId, invoiceDate, dueDate, totalAmount, reference } = invoiceData;

            // Insert Invoice Header
            db.query(
                "INSERT INTO sales_rep_invoices (invoice_number, sales_rep_id, invoice_date, due_date, total_amount, reference) VALUES (?, ?, ?, ?, ?, ?)",
                [invoiceNumber, salesRepId, invoiceDate, dueDate, totalAmount, reference],
                (err, result) => {
                    if (err) {
                        return db.rollback(() => reject(err));
                    }

                    const invoiceId = result.insertId;

                    // Insert Invoice Items
                    const itemValues = items.map(item => [
                        invoiceId,
                        item.productId,
                        item.productName,
                        item.quantity,
                        item.unitPrice,
                        item.total
                    ]);

                    db.query(
                        "INSERT INTO sales_rep_invoice_items (invoice_id, product_id, product_name, quantity, unit_price, total) VALUES ?",
                        [itemValues],
                        (err) => {
                            if (err) {
                                return db.rollback(() => reject(err));
                            }

                            db.commit((err) => {
                                if (err) {
                                    return db.rollback(() => reject(err));
                                }
                                resolve({ invoiceId, ...invoiceData });
                            });
                        }
                    );
                }
            );
        });
    });
};

// Update sales rep invoice status
const updateSalesRepInvoiceStatus = async (invoiceId, status) => {
    return new Promise((resolve, reject) => {
        db.query(
            "UPDATE sales_rep_invoices SET status = ? WHERE invoice_id = ?",
            [status, invoiceId],
            (err, result) => {
                if (err) reject(err);
                resolve(result);
            }
        );
    });
};

// Record payment for sales rep invoice
const recordInvoicePayment = async (paymentData) => {
    return new Promise((resolve, reject) => {
        const { invoiceId, amount, paymentDate, paymentMethod, reference, notes } = paymentData;

        db.beginTransaction((err) => {
            if (err) return reject(err);

            // Insert payment record
            const query = `INSERT INTO sales_rep_invoice_payments (invoice_id, amount, payment_date, payment_method, reference, notes) VALUES (?, ?, ?, ?, ?, ?)`;
            db.query(query, [invoiceId, amount, paymentDate, paymentMethod, reference, notes], (err, result) => {
                if (err) return db.rollback(() => reject(err));

                db.commit((err) => {
                    if (err) return db.rollback(() => reject(err));
                    resolve(result);
                });
            });
        });
    });
};

// Get total payments for an invoice
const getInvoiceTotalPaid = async (invoiceId) => {
    return new Promise((resolve, reject) => {
        const query = `SELECT COALESCE(SUM(amount), 0) as total_paid FROM sales_rep_invoice_payments WHERE invoice_id = ?`;
        db.query(query, [invoiceId], (err, result) => {
            if (err) reject(err);
            resolve(result[0].total_paid);
        });
    });
};

// Get payment history for an invoice
const getInvoicePayments = async (invoiceId) => {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM sales_rep_invoice_payments WHERE invoice_id = ? ORDER BY payment_date DESC`;
        db.query(query, [invoiceId], (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
};

module.exports = {
    createSalesRep,
    findByUniqueId,
    getAllSalesReps,
    getSalesRepById,
    updateSalesRep,
    deleteSalesRep,
    updateDebt,
    recordPayment,
    getPaymentsBySalesRep,
    getAllSalesRepInvoices,
    getSalesRepInvoiceById,
    createSalesRepInvoice,
    updateSalesRepInvoiceStatus,
    recordInvoicePayment,
    getInvoiceTotalPaid,
    getInvoicePayments
};