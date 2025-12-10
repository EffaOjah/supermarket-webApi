const db = require('../config/dbConfig');

const createLeaveRequest = (data) => {
    return new Promise((resolve, reject) => {
        const { employeeId, leaveType, startDate, endDate, daysRequested, reason } = data;
        const query = `
            INSERT INTO leave_requests (employee_id, leave_type, start_date, end_date, days_requested, reason)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        db.query(query, [employeeId, leaveType, startDate, endDate, daysRequested, reason], (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
};

const getLeavesByEmployee = (employeeId) => {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM leave_requests WHERE employee_id = ? ORDER BY created_at DESC`;
        db.query(query, [employeeId], (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
};

const getAllLeaves = () => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT lr.*, e.first_name, e.last_name, e.department 
            FROM leave_requests lr
            JOIN employees e ON lr.employee_id = e.employee_id
            ORDER BY lr.created_at DESC
        `;
        db.query(query, (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
};

const updateLeaveStatus = (leaveId, status, approvedBy) => {
    return new Promise((resolve, reject) => {
        const query = `UPDATE leave_requests SET status = ?, approved_by = ? WHERE leave_id = ?`;
        db.query(query, [status, approvedBy, leaveId], (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
};

module.exports = {
    createLeaveRequest,
    getLeavesByEmployee,
    getAllLeaves,
    updateLeaveStatus
};
