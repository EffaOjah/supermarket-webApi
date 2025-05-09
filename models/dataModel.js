const db = require('../config/dbConfig');


const getBranchById = async (branchId) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM store_branches WHERE branch_id = ?', [branchId], (err, result) => {
            if (err) {
                reject(err);
            }
            resolve(result);
        }); 
    });
};

const getProducts = async (status) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM products P INNER JOIN suppliers s ON p.supplier_id = s.supplier_id WHERE p.status = ?', [status], (err, result) => {
            if (err) {
                reject(err);
            }
            resolve(result);
        });
    });
}

const checkForStock = async (branchId, status) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM branch_stock INNER JOIN products ON branch_stock.product_id = products.product_id INNER JOIN suppliers ON products.supplier_id = suppliers.supplier_id WHERE branch_stock.branch_id = ? AND branch_stock.status = ?', [branchId, status], (err, result) => {
            if (err) {
                reject(err);
            }
            resolve(result);
        });
    });
}

const getBranchProducts = async (branchId) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM branch_stock INNER JOIN products ON branch_stock.product_id = products.product_id INNER JOIN suppliers ON products.supplier_id = suppliers.supplier_id WHERE branch_stock.branch_id = ?', [branchId], (err, result) => {
            if (err) {
                reject(err);
            }
            resolve(result);
        }); 
    });
};

const updateStockStatus = async (placeholders, productIDs, status) => {
    return new Promise((resolve, reject) => {
        db.query(`UPDATE branch_stock SET status = ? WHERE product_id IN (${placeholders})`, [status, ...productIDs], (err, result) => {
            if (err) {
                reject(err);
            }
            resolve(result);
        });
    });
}

module.exports = { getBranchById, getProducts, checkForStock, getBranchProducts, updateStockStatus };