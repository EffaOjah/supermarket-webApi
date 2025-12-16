const db = require('../config/dbConfig');

// Get all invoices
const getAllInvoices = async () => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT i.*, c.name as customer_name, 
            COALESCE(SUM(p.amount), 0) as amount_paid
            FROM invoices i 
            JOIN customers c ON i.customer_id = c.customer_id 
            LEFT JOIN payments p ON i.invoice_id = p.invoice_id
            GROUP BY i.invoice_id
            ORDER BY i.invoice_date DESC
        `;
        db.query(query, (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
};

// Get invoice by ID
const getInvoiceById = async (invoiceId) => {
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM invoices WHERE invoice_id = ?", [invoiceId], (err, invoice) => {
            if (err) return reject(err);
            if (!invoice || invoice.length === 0) return resolve(null);

            // Get items
            db.query("SELECT * FROM invoice_items WHERE invoice_id = ?", [invoiceId], (err, items) => {
                if (err) return reject(err);

                // Get customer details
                db.query("SELECT * FROM customers WHERE customer_id = ?", [invoice[0].customer_id], (err, customer) => {
                    if (err) return reject(err);

                    resolve({
                        ...invoice[0],
                        items: items,
                        customer: customer[0]
                    });
                });
            });
        });
    });
};

// Create new invoice
const createInvoice = async (invoiceData, items) => {
    return new Promise((resolve, reject) => {
        db.beginTransaction((err) => {
            if (err) return reject(err);

            const { invoiceNumber, customerId, invoiceDate, dueDate, totalAmount, reference } = invoiceData;

            // Insert Invoice Header
            db.query(
                "INSERT INTO invoices (invoice_number, customer_id, invoice_date, due_date, total_amount, reference) VALUES (?, ?, ?, ?, ?, ?)",
                [invoiceNumber, customerId, invoiceDate, dueDate, totalAmount, reference],
                (err, result) => {
                    if (err) {
                        return db.rollback(() => reject(err));
                    }

                    const invoiceId = result.insertId;

                    // Insert Invoice Items
                    const itemValues = items.map(item => [
                        invoiceId,
                        item.description,
                        item.quantity,
                        item.unitPrice,
                        item.total
                    ]);

                    db.query(
                        "INSERT INTO invoice_items (invoice_id, description, quantity, unit_price, total) VALUES ?",
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

// Update invoice status
const updateInvoiceStatus = async (invoiceId, status) => {
    return new Promise((resolve, reject) => {
        db.query(
            "UPDATE invoices SET status = ? WHERE invoice_id = ?",
            [status, invoiceId],
            (err, result) => {
                if (err) reject(err);
                resolve(result);
            }
        );
    });
};

module.exports = {
    getAllInvoices,
    getInvoiceById,
    createInvoice,
    updateInvoiceStatus
};
