const db = require('../config/dbConfig');

const uploadProduct = async (productName, wholsesalePrice, retailPrice, supplierId, category) => {
    return new Promise((resolve, reject) => {
        db.query('INSERT INTO products (product_name, wholesale_price, retail_price, supplier_id, category) VALUES(?, ?, ?, ?, ?)', [productName, wholsesalePrice, retailPrice, supplierId, category], (err, result) => {
            if (err) {
                reject(err);
            }
            resolve(result);
        }); 
    });
};

const getProducts = async () => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM products INNER JOIN suppliers ON products.supplier_id = suppliers.supplier_id', (err, result) => {
            if (err) {
                reject(err);
            }
            resolve(result);
        }); 
    });
};

const getBranches = async () => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM store_branches', (err, result) => {
            if (err) {
                reject(err);
            }
            resolve(result);
        }); 
    });
};

const getStoreBranchById = async (branchId) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM store_branches WHERE branch_id = ?', [branchId], (err, result) => {
            if (err) {
                reject(err);
            }
            resolve(result);
        }); 
    });
};

const getBranchProducts = async (branchId) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM products WHERE branch_id = ?', [branchId], (err, result) => {
            if (err) {
                reject(err);
            }
            resolve(result);
        }); 
    });
};

// Get all branch sales
const getBranchSales = async (branchId) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM sales WHERE branch_id = ?', [branchId], (err, result) => {
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

// Update existing branch stock quantity
const updateBranchStock = async (branchId, productId, quantity) => {
    return new Promise((resolve, reject) => {
        db.query('UPDATE branch_stock SET quantity = ? WHERE branch_id = ? AND product_id = ?', [quantity, branchId, productId], (err, result) => {
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

// Get all suppliers
const getSuppliers = async () => {
    return new Promise((resolve, reject) => {
        db.query('SELECT supplier_id, name FROM suppliers', (err, result) => {
            if (err) {
                reject(err);
            }
            resolve(result);
        }); 
    });
};

module.exports = { uploadProduct, getProducts, getBranches, getStoreBranchById, getBranchProducts, getBranchSales, getProductById, getExistingBranchProduct, updateBranchStock, insertBranchStock, getSuppliers };