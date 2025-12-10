const db = require('../config/dbConfig');

// Add new employee with transaction
const addStaff = async (employeeData) => {
    return new Promise((resolve, reject) => {
        const {
            staffId, firstName, lastName, email, phone, address,
            department, jobRole, bankName, accountNumber, accountName,
            taxId, pensionId, structureId, basicSalary
        } = employeeData;

        db.beginTransaction(function (err) {
            if (err) { return reject(err); }

            const query = `
                INSERT INTO employees 
                (staff_id, first_name, last_name, email, phone, address, department, job_role, bank_name, account_number, account_name, tax_id, pension_id) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            db.query(query,
                [staffId, firstName, lastName, email, phone, address, department, jobRole, bankName, accountNumber, accountName, taxId, pensionId],
                (err, result) => {
                    if (err) {
                        return db.rollback(function () {
                            reject(err);
                        });
                    }

                    const employeeId = result.insertId;

                    // Insert Salary Config
                    const configQuery = `INSERT INTO employee_salary_config (employee_id, structure_id, basic_salary) VALUES (?, ?, ?)`;

                    db.query(configQuery, [employeeId, structureId || null, basicSalary || 0], (err, result) => {
                        if (err) {
                            return db.rollback(function () {
                                reject(err);
                            });
                        }

                        db.commit(function (err) {
                            if (err) {
                                return db.rollback(function () {
                                    reject(err);
                                });
                            }
                            resolve(result);
                        });
                    });
                }
            );
        });
    });
}

// Get all employees
// Get all employees
const getAllStaff = async () => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT e.*, esc.structure_id, esc.basic_salary, ss.name as structure_name
            FROM employees e
            LEFT JOIN employee_salary_config esc ON e.employee_id = esc.employee_id
            LEFT JOIN salary_structures ss ON esc.structure_id = ss.structure_id
            ORDER BY e.created_at DESC
        `;
        db.query(query, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

// Get employee by ID with salary config
const getStaffById = (id) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT e.*, esc.structure_id, esc.basic_salary, ss.name as structure_name
            FROM employees e
            LEFT JOIN employee_salary_config esc ON e.employee_id = esc.employee_id
            LEFT JOIN salary_structures ss ON esc.structure_id = ss.structure_id
            WHERE e.employee_id = ?
        `;
        db.query(query, [id], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

// Update employee with transaction
const updateStaff = (id, updatedData) => {
    return new Promise((resolve, reject) => {
        const {
            firstName, lastName, email, phone, address,
            department, jobRole, bankName, accountNumber, accountName,
            taxId, pensionId, structureId, basicSalary
        } = updatedData;

        db.beginTransaction(function (err) {
            if (err) { return reject(err); }

            const query = `
                UPDATE employees 
                SET first_name = ?, last_name = ?, email = ?, phone = ?, address = ?, department = ?, job_role = ?, 
                bank_name = ?, account_number = ?, account_name = ?, tax_id = ?, pension_id = ?
                WHERE employee_id = ?
            `;

            db.query(query,
                [firstName, lastName, email, phone, address, department, jobRole, bankName, accountNumber, accountName, taxId, pensionId, id],
                (err, result) => {
                    if (err) {
                        return db.rollback(function () {
                            reject(err);
                        });
                    }

                    // Check if salary config exists, if not insert, else update
                    const checkConfig = "SELECT * FROM employee_salary_config WHERE employee_id = ?";
                    db.query(checkConfig, [id], (err, rows) => {
                        if (err) {
                            return db.rollback(function () {
                                reject(err);
                            });
                        }

                        let configQuery;
                        let configParams;

                        if (rows.length > 0) {
                            configQuery = "UPDATE employee_salary_config SET structure_id = ?, basic_salary = ? WHERE employee_id = ?";
                            configParams = [structureId || null, basicSalary || 0, id];
                        } else {
                            configQuery = "INSERT INTO employee_salary_config (structure_id, basic_salary, employee_id) VALUES (?, ?, ?)";
                            configParams = [structureId || null, basicSalary || 0, id];
                        }

                        db.query(configQuery, configParams, (err, result) => {
                            if (err) {
                                return db.rollback(function () {
                                    reject(err);
                                });
                            }
                            db.commit(function (err) {
                                if (err) {
                                    return db.rollback(function () {
                                        reject(err);
                                    });
                                }
                                resolve(result);
                            });
                        });
                    });
                }
            );
        });
    });
}

module.exports = {
    addStaff,
    getAllStaff,
    getStaffById,
    updateStaff
}