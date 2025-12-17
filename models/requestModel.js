const db = require('../config/dbConfig');

// Create request with items (Transaction)
const createRequest = (salesRepId, items) => {
    return new Promise((resolve, reject) => {
        db.beginTransaction((err) => {
            if (err) return reject(err);

            const totalAmount = items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);

            // Insert Request Header
            db.query(
                "INSERT INTO product_requests (sales_rep_id, total_amount, status) VALUES (?, ?, 'PENDING')",
                [salesRepId, totalAmount],
                (err, result) => {
                    if (err) return db.rollback(() => reject(err));

                    const requestId = result.insertId;
                    const requestItems = items.map(item => [
                        requestId,
                        item.productId,
                        item.productName,
                        item.quantity,
                        item.unitPrice,
                        item.unitPrice * item.quantity
                    ]);

                    // Insert Items
                    db.query(
                        "INSERT INTO request_items (request_id, product_id, product_name, quantity, unit_price, total_price) VALUES ?",
                        [requestItems],
                        (err) => {
                            if (err) return db.rollback(() => reject(err));

                            db.commit((err) => {
                                if (err) return db.rollback(() => reject(err));
                                resolve({ requestId, totalAmount });
                            });
                        }
                    );
                }
            );
        });
    });
};

// Get all requests
const getAllRequests = () => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT r.*, s.name as sales_rep_name, s.unique_id 
            FROM product_requests r 
            JOIN sales_reps s ON r.sales_rep_id = s.id 
            ORDER BY r.created_at DESC`;
        db.query(query, (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

// Get requests by status
const getRequestsByStatus = (status) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT r.*, s.name as sales_rep_name, s.unique_id, s.debt
            FROM product_requests r 
            JOIN sales_reps s ON r.sales_rep_id = s.id 
            WHERE r.status = ? 
            ORDER BY r.created_at ASC`;
        db.query(query, [status], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

// Get request by ID with items
const getRequestById = (id) => {
    return new Promise((resolve, reject) => {
        db.query(
            `SELECT r.*, s.name as sales_rep_name, s.debt, s.id as sales_rep_actual_id, s.unique_id as sales_rep_unique_id 
             FROM product_requests r 
             JOIN sales_reps s ON r.sales_rep_id = s.id 
             WHERE r.id = ?`,
            [id],
            (err, request) => {
                if (err) return reject(err);
                if (request.length === 0) return resolve(null);

                db.query("SELECT * FROM request_items WHERE request_id = ?", [id], (err, items) => {
                    if (err) return reject(err);
                    resolve({ ...request[0], items });
                });
            }
        );
    });
};

// Update request status
const updateRequestStatus = (id, status) => {
    return new Promise((resolve, reject) => {
        db.query("UPDATE product_requests SET status = ? WHERE id = ?", [status, id], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

// Get requests for a specific sales rep
const getRequestsBySalesRep = (salesRepId) => {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM product_requests WHERE sales_rep_id = ? ORDER BY created_at DESC";
        db.query(query, [salesRepId], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

module.exports = {
    createRequest,
    getAllRequests,
    getRequestsByStatus,
    getRequestById,
    updateRequestStatus,
    getRequestsBySalesRep
};
