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

// Get product by product_id and type from branch stock
const getProductByIdAndType = async (productId, type, branchId) => {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT branch_id, product_id, ${type} AS product_quantity FROM branch_stock WHERE product_id = ? AND branch_id = ?`,
      [productId, branchId],
      (err, result) => {
        if (err) {
          reject(err);
        }
        resolve(result.length < 1 ? null : result[0]);
      }
    );
  });
};

// Handle insert and subtract
const insertAndSubtract = async (branchId, branchName, targetBranchId, targetBranchName, productId, type, transferQuantity) => {
  return new Promise((resolve, reject) => {
    db.beginTransaction();

    // Add new branch stock from transfer
    db.query(
      `INSERT INTO branch_stock (branch_id, product_id, ${type}) VALUES(?, ?, ?)`,
      [targetBranchId, productId, transferQuantity],
      (err) => {
        if (err) {
          db.rollback();
          return reject(err);
        }
      }
    );

    // Subtract branch stock quantity from transfer
    db.query(
      `UPDATE branch_stock SET ${type} = ${type} - ?, status = ? WHERE branch_id = ? AND product_id = ?`,
      [transferQuantity, "pending", branchId, productId],
      (err) => {
        if (err) {
          db.rollback();
          return reject(err);
        }
      }
    );

    // Insert into stock transfer history table
    let theType = type == 'stock_quantity_wholesale' ? 'wholesale' : 'retail';
    db.query(
      "INSERT INTO stock_transfer_history (branch_name, branch_id, target_branch_id, target_branch_name, product_id, type, quantity) VALUES(?, ?, ?, ?, ?, ?, ?)", [branchName, branchId, targetBranchId, targetBranchName, productId, theType, transferQuantity], (err, result) => {
        if (err) {
          db.rollback();
          return reject(err);
        }
        db.commit();
        return resolve('Successfully inserted and subtracted!');
      }
    );
  });
};

// Update existing branch stock quantity from transfer
const updateAndSubtract = async (branchId, branchName, targetBranchId, targetBranchName, productId, type, transferQuantity) => {
  return new Promise((resolve, reject) => {
    db.beginTransaction();

    // Update branch stock quantity from transfer
    db.query(
      `UPDATE branch_stock SET ${type} = ${type} + ?, status = ? WHERE branch_id = ? AND product_id = ?`,
      [transferQuantity, "pending", targetBranchId, productId],
      (err) => {
        if (err) {
          db.rollback();
          return reject(err);
        }
      }
    );

    // Subtract branch stock quantity from transfer
    db.query(
      `UPDATE branch_stock SET ${type} = ${type} - ?, status = ? WHERE branch_id = ? AND product_id = ?`,
      [transferQuantity, "pending", branchId, productId],
      (err) => {
        if (err) {
          db.rollback();
          return reject(err);
        }
      }
    );

    // Insert into stock transfer history table
    let theType = type == 'stock_quantity_wholesale' ? 'wholesale' : 'retail';
    db.query(
      "INSERT INTO stock_transfer_history (branch_name, branch_id, target_branch_id, target_branch_name, product_id, type, quantity) VALUES(?, ?, ?, ?, ?, ?, ?)", [branchName, branchId, targetBranchId, targetBranchName, productId, theType, transferQuantity], (err, result) => {
        if (err) {
          db.rollback();
          return reject(err);
        }
        db.commit();
        return resolve('Successfully updated and subtracted!');
      }
    );
  });
};

// Get all branches
const getAllBranches = async () => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM store_branches", (err, result) => {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
};

// Get stock transfer history
const getStockTransferHistory = async (branchId) => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM stock_transfer_history INNER JOIN products ON stock_transfer_history.product_id = products.product_id WHERE stock_transfer_history.branch_id = ?", [branchId], (err, result) => {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
}

// Get stock received history
const getStockReceivedHistory = async (branchId) => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM stock_transfer_history INNER JOIN products ON stock_transfer_history.product_id = products.product_id WHERE stock_transfer_history.target_branch_id = ?", [branchId], (err, result) => {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
}

// Get branch overview
const getBranchOverview = async (branchId) => {
  return new Promise((resolve, reject) => {
    db.query(`SELECT 
    bs.branch_id,
    SUM(si.sub_total) AS total_revenue,
    SUM(
        CASE 
            WHEN si.sale_type = 'wholesale' 
                THEN si.quantity * COALESCE(p.wholesale_cost_price, 0)
            WHEN si.sale_type = 'retail' 
                THEN si.quantity * COALESCE(p.retail_cost_price, 0)
            ELSE 0
        END
    ) AS total_cost,
    (
      SUM(si.sub_total) -
      SUM(
        CASE 
            WHEN si.sale_type = 'wholesale' 
                THEN si.quantity * COALESCE(p.wholesale_cost_price, 0)
            WHEN si.sale_type = 'retail' 
                THEN si.quantity * COALESCE(p.retail_cost_price, 0)
            ELSE 0
        END
      )
    ) AS profit_or_loss
      FROM branch_sales bs
      JOIN sale_items si ON bs.sale_id = si.sale_id
      JOIN products p ON si.product_id = p.product_id
      WHERE bs.branch_id = ?
      GROUP BY bs.branch_id;`,
      [branchId], (err, result) => {
        if (err) {
          reject(err);
        }
        resolve(result);
      });
  });
};

// Function to insert into stock transfer history table
// const insertIntoStockTransferHistory = async (branchId, targetBranchId, productId, type, quantity) => {
//   return new Promise((resolve, reject) => {
//     db.query(
//       "INSERT INTO stock_transfer_history (branch_id, target_branch_id, product_id, type, quantity) VALUES(?, ?, ?, ?, ?)", [branchId, targetBranchId, productId, type, quantity], (err, result) => {
//         if (err) {
//           reject(err);
//         }
//         resolve(result);
//       }
//     );
//   });
// };


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
  checkRetailStockLevel,
  getProductByIdAndType,
  insertAndSubtract,
  updateAndSubtract,
  getAllBranches,
  getStockTransferHistory,
  getStockReceivedHistory,
  getBranchOverview
};
