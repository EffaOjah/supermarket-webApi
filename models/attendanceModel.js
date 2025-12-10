const db = require('../config/dbConfig');

// Clock In
const clockIn = (employeeId) => {
    return new Promise((resolve, reject) => {
        const today = new Date().toISOString().slice(0, 10);
        const now = new Date();

        // Check if already clocked in
        db.query("SELECT * FROM attendance WHERE employee_id = ? AND date = ?", [employeeId, today], (err, result) => {
            if (err) return reject(err);
            if (result.length > 0) return reject(new Error('Already clocked in for today'));

            const query = "INSERT INTO attendance (employee_id, date, clock_in, status) VALUES (?, ?, ?, 'Present')";
            db.query(query, [employeeId, today, now], (err, res) => {
                if (err) reject(err);
                resolve(res);
            });
        });
    });
};

// Clock Out
const clockOut = (employeeId) => {
    return new Promise((resolve, reject) => {
        const today = new Date().toISOString().slice(0, 10);
        const now = new Date();

        // Check if clocked in
        db.query("SELECT * FROM attendance WHERE employee_id = ? AND date = ?", [employeeId, today], (err, result) => {
            if (err) return reject(err);
            if (result.length === 0) return reject(new Error('No attendance record found for today'));
            if (result[0].clock_out) return reject(new Error('Already clocked out'));

            // Calculate overtime (assuming 9-5 work day = 8 hours)
            const clockInTime = new Date(result[0].clock_in);
            const durationMs = now - clockInTime;
            const hoursWorked = durationMs / (1000 * 60 * 60);
            let overtime = 0;
            if (hoursWorked > 9) { // 9 hours including 1 hr break
                overtime = hoursWorked - 9;
            }

            const query = "UPDATE attendance SET clock_out = ?, overtime_hours = ? WHERE attendance_id = ?";
            db.query(query, [now, overtime.toFixed(2), result[0].attendance_id], (err, res) => {
                if (err) reject(err);
                resolve(res);
            });
        });
    });
};

// Get Employee Attendance for a Month
const getEmployeeAttendance = (employeeId, month, year) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT * FROM attendance 
            WHERE employee_id = ? AND MONTH(date) = ? AND YEAR(date) = ?
            ORDER BY date DESC
        `;
        db.query(query, [employeeId, month, year], (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
};

// Get All Attendance for a Date (Admin view)
const getDailyAttendance = (date) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT a.*, e.first_name, e.last_name, e.department 
            FROM attendance a
            JOIN employees e ON a.employee_id = e.employee_id
            WHERE a.date = ?
        `;
        db.query(query, [date], (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
};

module.exports = {
    clockIn,
    clockOut,
    getEmployeeAttendance,
    getDailyAttendance
};
