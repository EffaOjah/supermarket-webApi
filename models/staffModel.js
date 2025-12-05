const db = require('../config/dbConfig');

// Add staff to payroll
const addStaff = async (staffName, email, phone, address, salary, level) => {
    return new Promise((resolve, reject) => {
        db.query('INSERT INTO payroll (staff_name, email, phone, address, salary, level) VALUES (?, ?, ?, ?, ?, ?)', [staffName, email, phone, address, salary, level], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

// Get all staff
const getAllStaff = async () => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM payroll ORDER BY created_at DESC', (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

// Get staff by payroll id
const getStaffByPayrollId = async (payrollId) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM payroll WHERE payroll_id = ?', [payrollId], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

// Update staff details
const updateStaff = async (staffName, email, phone, address, salary, level, payrollId) => {
    return new Promise((resolve, reject) => {
        db.query('UPDATE payroll SET staff_name = ?, email = ?, phone = ?, address = ?, salary = ?, level = ? WHERE payroll_id = ?', [staffName, email, phone, address, salary, level, payrollId], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

module.exports = {
    addStaff,
    getAllStaff,
    getStaffByPayrollId,
    updateStaff
}