const db = require("../config/dbConfig");

const getBranchById = async (branchId) => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM store_branches WHERE branch_id = ?",
      [branchId],
      (err, result) => {
        if (err) {
          reject(err);
        }
        resolve(result);
      }
    );
  });
};

const getProductsOnly = async () => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM products", (err, result) => {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
};

// Update existing branch wholesale stock quantity
const updateBranchStockWholesale = async (
  branchId,
  productId,
  wholesaleQuantity,
) => {
  return new Promise((resolve, reject) => {
    db.query(
      "UPDATE branch_stock SET stock_quantity_wholesale = stock_quantity_wholesale + ?, status = ? WHERE branch_id = ? AND product_id = ?",
      [wholesaleQuantity, "pending", branchId, productId],
      (err, result) => {
        if (err) {
          reject(err);
        }
        resolve(result);
      }
    );
  });
};

// Update existing branch retail stock quantity
const updateBranchStockRetail = async (
  branchId,
  productId,
  retailQuantity
) => {
  return new Promise((resolve, reject) => {
    db.query(
      "UPDATE branch_stock SET stock_quantity_retail = stock_quantity_retail + ?, status = ? WHERE branch_id = ? AND product_id = ?",
      [retailQuantity, "pending", branchId, productId],
      (err, result) => {
        if (err) {
          reject(err);
        }
        resolve(result);
      }
    );
  });
};

// Add new branch stock - wholesale
const insertBranchStockWholesale = async (
  branchId,
  productId,
  wholesaleQuantity,
) => {
  return new Promise((resolve, reject) => {
    db.query(
      "INSERT INTO branch_stock (branch_id, product_id, stock_quantity_wholesale) VALUES(?, ?, ?)",
      [branchId, productId, wholesaleQuantity],
      (err, result) => {
        if (err) {
          reject(err);
        }
        resolve(result);
      }
    );
  });
};

// Add new branch stock - retail
const insertBranchStockRetail = async (
  branchId,
  productId,
  retailQuantity,
) => {
  return new Promise((resolve, reject) => {
    db.query(
      "INSERT INTO branch_stock (branch_id, product_id, stock_quantity_retail) VALUES(?, ?, ?)",
      [branchId, productId, retailQuantity],
      (err, result) => {
        if (err) {
          reject(err);
        }
        resolve(result);
      }
    );
  });
};

// Get product by id
const getProductById = async (productId) => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM products WHERE product_id = ?",
      [productId],
      (err, result) => {
        if (err) {
          reject(err);
        }
        resolve(result);
      }
    );
  });
};

// Get existing branch stock
const getExistingBranchProduct = async (branchId, productId) => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM branch_stock WHERE branch_id = ? AND product_id = ?",
      [branchId, productId],
      (err, result) => {
        if (err) {
          reject(err);
        }
        resolve(result);
      }
    );
  });
};

const getBranchProducts = async (branchId) => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM branch_stock INNER JOIN products ON branch_stock.product_id = products.product_id INNER JOIN suppliers ON products.supplier_id = suppliers.supplier_id WHERE branch_stock.branch_id = ?",
      [branchId],
      (err, result) => {
        if (err) {
          reject(err);
        }
        resolve(result);
      }
    );
  });
};

// Get all branch sales
const getBranchSales = async (branchId) => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM branch_sales WHERE branch_id = ?",
      [branchId],
      (err, result) => {
        if (err) {
          reject(err);
        }
        resolve(result);
      }
    );
  });
};

// Get all branch sales
const getBranchSaleDetails = async (saleId) => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM sale_items INNER JOIN branch_sales ON sale_items.sale_id = branch_sales.sale_id INNER JOIN products ON sale_items.product_id = products.product_id WHERE sale_items.sale_id = ?",
      [saleId],
      (err, result) => {
        if (err) {
          reject(err);
        }
        resolve(result);
      }
    );
  });
};

// Update the last_inspected column of the branch
const updateLastInspected = (branchId) => {
  return new Promise((resolve, reject) => {
    db.query(
      "UPDATE store_branches SET last_inspected = CURRENT_TIMESTAMP WHERE branch_id = ?",
      [branchId],
      (err, result) => {
        if (err) {
          reject(err);
        }
        resolve(result);
      }
    );
  });
};

// Check the number of products with low stock
const checkLowProducts = (branchId) => {
  return new Promise((resolve, reject) => {
    db.query('SELECT COUNT(*) AS low_stock_count FROM branch_stock INNER JOIN products ON branch_stock.product_id = products.product_id WHERE branch_stock.branch_id = ? AND (branch_stock.stock_quantity_wholesale < branch_stock.reorder_level OR branch_stock.stock_quantity_retail < branch_stock.reorder_level)', [branchId], (err, result) => {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
};

// Check the wholesale stock level of the products
const checkWholesaleStockLevel = (branchId) => {
  return new Promise((resolve, reject) => {
    db.query('SELECT stock_id, product_name, stock_quantity_wholesale, reorder_level FROM branch_stock INNER JOIN products ON branch_stock.product_id = products.product_id WHERE branch_stock.stock_quantity_wholesale < branch_stock.reorder_level AND branch_stock.branch_id = ?', [branchId], (err, result) => {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
};

// Check the retail stock level of the products
const checkRetailStockLevel = (branchId) => {
  return new Promise((resolve, reject) => {
    db.query('SELECT stock_id, product_name, stock_quantity_retail, reorder_level FROM branch_stock INNER JOIN products ON branch_stock.product_id = products.product_id WHERE branch_stock.stock_quantity_retail < branch_stock.reorder_level AND branch_stock.branch_id = ?', [branchId], (err, result) => {
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
  updateBranchStockWholesale,
  updateBranchStockRetail,
  insertBranchStockWholesale,
  insertBranchStockRetail,
  getProductById,
  getExistingBranchProduct,
  getBranchProducts,
  getBranchSales,
  getBranchSaleDetails,
  updateLastInspected,
  checkLowProducts,
  checkWholesaleStockLevel,
  checkRetailStockLevel
};
