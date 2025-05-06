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

const getProductsOnly = async () => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM products', (err, result) => {
            if (err) {
                reject(err);
            }
            resolve(result);
        }); 
    });
};

// Update existing branch stock quantity
const updateBranchStock = async (branchId, productId, quantity) => {
    return new Promise((resolve, reject) => {
        db.query('UPDATE branch_stock SET quantity = quantity + ? WHERE branch_id = ? AND product_id = ?', [quantity, branchId, productId], (err, result) => {
            if (err) {
                reject(err);
            }
            resolve(result);
        }); 
    });
};

// Add new branch stock
const insertBranchStock = async (branchId, productId, quantity) => {
    return new Promise((resolve, reject) => {
        db.query('INSERT INTO branch_stock (branch_id, product_id, quantity) VALUES(?, ?, ?)', [branchId, productId, quantity], (err, result) => {
            if (err) {
                reject(err);
            }
            resolve(result);
        }); 
    });
};

// Get product by id
const getProductById = async (productId) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM products WHERE product_id = ?', [productId], (err, result) => {
            if (err) {
                reject(err);
            }
            resolve(result);
        }); 
    });
};

// Get existing branch stock
const getExistingBranchProduct = async (branchId, productId) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM branch_stock WHERE branch_id = ? AND product_id = ?', [branchId, productId], (err, result) => {
            if (err) {
                reject(err);
            }
            resolve(result);
        }); 
    });
};

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

module.exports = {
    getBranchById,
    getProductsOnly,
    updateBranchStock,
    insertBranchStock,
    getProductById,
    getExistingBranchProduct,
    getBranchProducts
};