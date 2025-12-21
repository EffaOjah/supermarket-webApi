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

module.exports = {
    createSalesRep,
    findByUniqueId,
    getAllSalesReps,
    getSalesRepById,
    updateSalesRep,
    deleteSalesRep,
    updateDebt,
    recordPayment,
    getPaymentsBySalesRep
};