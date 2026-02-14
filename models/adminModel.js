const db = require('../config/dbConfig');

const uploadProduct = async (productName, wholsesaleCostPrice, wholsesaleSellingPrice, retailCostPrice, retailSellingPrice, supplierId, category) => {
    return new Promise((resolve, reject) => {
        db.query('INSERT INTO products (product_name, wholesale_cost_price, wholesale_selling_price, retail_cost_price, retail_selling_price, supplier_id, category) VALUES(?, ?, ?, ?, ?, ?, ?)', [productName, wholsesaleCostPrice, wholsesaleSellingPrice, retailCostPrice, retailSellingPrice, supplierId, category], (err, result) => {
            if (err) {
                reject(err);
            }
            resolve(result);
        });
    });
};

const updateProduct = async (productName, wholsesaleCostPrice, wholsesaleSellingPrice, retailCostPrice, retailSellingPrice, supplierId, category, productId) => {
    return new Promise((resolve, reject) => {
        db.query('UPDATE products SET product_name = ?, wholesale_cost_price = ?, wholesale_selling_price = ?, retail_cost_price = ?, retail_selling_price = ?, supplier_id = ?, category = ? WHERE product_id = ?', [productName, wholsesaleCostPrice, wholsesaleSellingPrice, retailCostPrice, retailSellingPrice, supplierId, category, productId], (err, result) => {
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

const getProductByName = async (productName) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM products WHERE product_name = ?', [productName], (err, result) => {
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
        db.query('SELECT * FROM branch_sales WHERE branch_id = ?', [branchId], (err, result) => {
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
        db.query('SELECT * FROM products P INNER JOIN suppliers S ON P.supplier_id = S.supplier_id WHERE product_id = ?', [productId], (err, result) => {
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

// Get the analysis
const getTheAnalysis = async (type, date, branchId) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT SUM(sub_total) AS total FROM sale_items SI INNER JOIN branch_sales S ON SI.sale_id = S.sale_id WHERE SI.sale_type = ? AND S.sale_date LIKE CONCAT(?, "%") AND S.branch_id = ?', [type, date, branchId], (err, result) => {
            if (err) {
                reject(err);
            }
            resolve(result);
        });
    });
}

// Get the analysis from date range
const getSalesAnalysisFromRange = async (branchId, type, startDate, endDate) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT SUM(sub_total) AS total FROM sale_items SI INNER JOIN branch_sales S ON SI.sale_id = S.sale_id WHERE S.branch_id = ? AND SI.sale_type = ? AND S.sale_date >= ? AND S.sale_date <= CONCAT(?, " 23:59:59")', [branchId, type, startDate, endDate], (err, result) => {
            if (err) {
                reject(err);
            }
            resolve(result);
        });
    });
}


module.exports = { uploadProduct, updateProduct, getProducts, getProductByName, getBranches, getStoreBranchById, getBranchProducts, getBranchSales, getProductById, getExistingBranchProduct, updateBranchStock, insertBranchStock, getSuppliers, getTheAnalysis, getSalesAnalysisFromRange };