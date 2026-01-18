const db = require('../config/dbConfig');

// Get all customers
const getAllCustomers = async (branchId = null) => {
    return new Promise((resolve, reject) => {
        let query = "SELECT * FROM customers";
        const params = [];

        if (branchId) {
            query += " WHERE branch_id = ?";
            params.push(branchId);
        }

        query += " ORDER BY name";

        db.query(query, params, (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
};

// Get customer by ID
const getCustomerById = async (customerId) => {
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM customers WHERE customer_id = ?", [customerId], (err, result) => {
            if (err) reject(err);
            resolve(result[0]);
        });
    });
};

// Add new customer
const addCustomer = async (customerData) => {
    return new Promise((resolve, reject) => {
        const { name, email, phone, address, branchId } = customerData;
        db.query(
            "INSERT INTO customers (name, email, phone, address, branch_id) VALUES (?, ?, ?, ?, ?)",
            [name, email, phone, address, branchId],
            (err, result) => {
                if (err) reject(err);
                resolve(result);
            }
        );
    });
};

// Update customer balance
const updateCustomerBalance = async (customerId, amount) => {
    return new Promise((resolve, reject) => {
        // amount can be positive (invoice) or negative (payment)
        db.query(
            "UPDATE customers SET account_balance = account_balance + ? WHERE customer_id = ?",
            [amount, customerId],
            (err, result) => {
                if (err) reject(err);
                resolve(result);
            }
        );
    });
};

module.exports = {
    getAllCustomers,
    getCustomerById,
    addCustomer,
    updateCustomerBalance
};
