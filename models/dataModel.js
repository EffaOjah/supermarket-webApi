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

const getAllProducts = async () => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM products p INNER JOIN suppliers s ON p.supplier_id = s.supplier_id', (err, result) => {
            if (err) {
                reject(err);
            }
            resolve(result);
        });
    });
}

const getUpdatedProducts = async (lastSynced) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM products p INNER JOIN suppliers s ON p.supplier_id = s.supplier_id WHERE p.date_modified > ?', [lastSynced], (err, result) => {
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

const insertSale = async (branchId, sales) => {
    return new Promise((resolve, reject) => {
        // Convert sales objects into nested arrays for bulk insert
        const values = sales.map(sale => [
            branchId,
            sale.name,
            sale.contact,
            sale.total_amount,
            sale.payment_method,
            sale.sales_date
        ]);

        const sql = `INSERT INTO branch_sales (branch_id, customer_name, customer_phoneNo, total_amount, payment_method, sale_date) VALUES ?`;

        db.query(sql, [values], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

const insertSaleItems = async (saleItems) => {
    return new Promise((resolve, reject) => {
        // Convert sales objects into nested arrays for bulk insert
        const values = saleItems.map(saleItem => [
            saleItem.sale_id,
            saleItem.product_id,
            saleItem.quantity,
            saleItem.unit_price,
            saleItem.sale_type,
            saleItem.subtotal,            
        ]);

        db.query('INSERT INTO sale_items (sale_id, product_id, quantity, unit_price, sale_type, sub_total) VALUES ?', [values], (err, result) => {
            if (err) {
                reject(err);
            }
            resolve(result);
        });
    });
}

const handleSalesSyncing = async (branchId, sales, saleItems) => {
    return new Promise((resolve, reject) => {
        db.beginTransaction((err) => {
            if (err) return reject(err);

            const values = sales.map(sale => [
                sale.sale_id,
                branchId,
                sale.name,
                sale.contact,
                sale.total_amount,
                sale.payment_method,
                sale.sales_date
            ]);

            const insertSalesSql = `
                INSERT INTO branch_sales 
                (sale_id, branch_id, customer_name, customer_phoneNo, total_amount, payment_method, sale_date) 
                VALUES ?
            `;

            db.query(insertSalesSql, [values], (err, salesResult) => {
                if (err) return db.rollback(() => reject(err));

                const values2 = saleItems.map(saleItem => [
                    saleItem.sale_item_id,
                    saleItem.sale_id,
                    saleItem.product_id,
                    saleItem.quantity,
                    saleItem.unit_price,
                    saleItem.sale_type,
                    saleItem.subtotal
                ]);

                const insertItemsSql = `
                    INSERT INTO sale_items 
                    (sale_item_id, sale_id, product_id, quantity, unit_price, sale_type, sub_total) 
                    VALUES ?
                `;

                db.query(insertItemsSql, [values2], (err, itemsResult) => {
                    if (err) return db.rollback(() => reject(err));

                    db.commit((err) => {
                        if (err) return db.rollback(() => reject(err));
                        console.log('Transaction committed.');
                        resolve({ salesResult, itemsResult });
                    });
                });
            });
        });
    });
};

module.exports = { getBranchById, getProducts, getAllProducts, getUpdatedProducts, checkForStock, getBranchProducts, updateStockStatus, insertSale, insertSaleItems, handleSalesSyncing };