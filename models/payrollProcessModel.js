const db = require('../config/dbConfig');

// Helper: Get active employees with their salary config
const getActiveEmployeesForPayroll = () => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT e.employee_id, e.first_name, e.last_name, e.email, e.department, 
                   esc.structure_id, esc.basic_salary, ss.name as structure_name
            FROM employees e
            LEFT JOIN employee_salary_config esc ON e.employee_id = esc.employee_id
            LEFT JOIN salary_structures ss ON esc.structure_id = ss.structure_id
            WHERE e.employment_status = 'Active'
        `;
        db.query(query, (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
};

// Helper: Get salary components for a structure or global
const getComponentsForEmployee = (structureId) => {
    return new Promise((resolve, reject) => {
        // Get structure specific components + Global active components that might not be in structure but apply?
        // For simplicity, let's strictly follow structure definition + core components

        let query = `
            SELECT sc.name, sc.type, sc.is_taxable, ssc.default_amount, ssc.percentage_of_basic
            FROM salary_structure_components ssc
            JOIN salary_components sc ON ssc.component_id = sc.component_id
            WHERE ssc.structure_id = ?
        `;

        if (!structureId) {
            // If no structure, maybe return empty or default?
            return resolve([]);
        }

        db.query(query, [structureId], (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
};

// Helper: Get attendance summary for the period
const getAttendanceSummary = (employeeId, startDate, endDate) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT COUNT(*) as days_present, SUM(overtime_hours) as total_overtime
            FROM attendance
            WHERE employee_id = ? AND date BETWEEN ? AND ? AND status = 'Present'
        `;
        db.query(query, [employeeId, startDate, endDate], (err, result) => {
            if (err) reject(err);
            resolve(result[0]);
        });
    });
};

// Create Payroll Run Record
const createPayrollRun = (startDate, endDate, totalGross, totalDeductions, totalNet) => {
    return new Promise((resolve, reject) => {
        const query = `
            INSERT INTO payroll_runs (pay_period_start, pay_period_end, total_gross, total_deductions, total_net, status)
            VALUES (?, ?, ?, ?, ?, 'Draft')
        `;
        db.query(query, [startDate, endDate, totalGross, totalDeductions, totalNet], (err, result) => {
            if (err) reject(err);
            resolve(result.insertId);
        });
    });
};

// Save Payslip
const createPayslip = (runId, employeeId, basic, allowances, deductions, net, detailsJson) => {
    return new Promise((resolve, reject) => {
        const query = `
            INSERT INTO payslips (run_id, employee_id, basic_salary, total_allowances, total_deductions, net_salary, payslip_json)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        db.query(query, [runId, employeeId, basic, allowances, deductions, net, JSON.stringify(detailsJson)], (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
};

const getPayrollRuns = () => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT *, (SELECT COUNT(*) FROM payslips WHERE run_id = payroll_runs.run_id) as employee_count FROM payroll_runs ORDER BY run_date DESC`, (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
};

const getPayslipsByRun = (runId) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT p.*, e.first_name, e.last_name, e.department, e.job_role
            FROM payslips p
            JOIN employees e ON p.employee_id = e.employee_id
            WHERE p.run_id = ?
        `;
        db.query(query, [runId], (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
};

const getPayslipById = (id) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT p.*, e.first_name, e.last_name, e.department, e.job_role, e.staff_id, pr.pay_period_start, pr.pay_period_end
            FROM payslips p
            JOIN employees e ON p.employee_id = e.employee_id
            JOIN payroll_runs pr ON p.run_id = pr.run_id
            WHERE p.payslip_id = ?
        `;
        db.query(query, [id], (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
};

module.exports = {
    getActiveEmployeesForPayroll,
    getComponentsForEmployee,
    getAttendanceSummary,
    createPayrollRun,
    createPayslip,
    getPayrollRuns,
    getPayslipsByRun,
    getPayslipById
};
