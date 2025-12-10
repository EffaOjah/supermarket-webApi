const payrollProcessModel = require('../models/payrollProcessModel');

// Page: Run Payroll Form
const getRunPayrollPage = (req, res) => {
    res.render('payroll/run-payroll');
};

// Page: Payroll History
const getPayrollHistory = async (req, res) => {
    try {
        const runs = await payrollProcessModel.getPayrollRuns();
        res.render('payroll/history', { runs });
    } catch (error) {
        console.error(error);
        req.flash('error_msg', 'Failed to load history');
        res.redirect('/admin/dashboard');
    }
};

// Page: View Single Run Details
const viewPayrollRun = async (req, res) => {
    try {
        const { runId } = req.params;
        const payslips = await payrollProcessModel.getPayslipsByRun(runId);
        res.render('payroll/run-details', { payslips, runId });
    } catch (error) {
        console.error(error);
        req.flash('error_msg', 'Failed to load details');
        res.redirect('/payroll/history');
    }
};

// Action: Process Payroll
const processPayroll = async (req, res) => {
    try {
        const { startDate, endDate } = req.body;

        // 1. Get employees
        const employees = await payrollProcessModel.getActiveEmployeesForPayroll();

        if (employees.length === 0) {
            req.flash('error_msg', 'No active employees to process');
            return res.redirect('/payroll/run');
        }

        let runTotalGross = 0;
        let runTotalDeductions = 0;
        let runTotalNet = 0;
        const allPayslips = [];

        // 2. Loop and Calculate
        for (const emp of employees) {
            // Determine Basic Salary
            // If esc.basic_salary is > 0 use it, else if structure has a base? 
            // Our structure table doesn't have a base amount column, so we assume basic is set on employee config or we grab the "Basic Salary" component value if strictly component based.
            // But previous staff form logic implies basic salary is explicit.

            let basicSalary = parseFloat(emp.basic_salary) || 0;

            // Get components for this employee's structure
            const components = await payrollProcessModel.getComponentsForEmployee(emp.structure_id);

            let totalAllowances = 0;
            let totalDeductions = 0;

            const payslipComponents = [];

            // Add Basic to components list for display
            payslipComponents.push({ name: 'Basic Salary', type: 'Earning', amount: basicSalary });

            for (const comp of components) {
                let amount = 0;

                if (comp.percentage_of_basic > 0) {
                    amount = (comp.percentage_of_basic / 100) * basicSalary;
                } else {
                    amount = parseFloat(comp.default_amount) || 0;
                }

                // Logic for specific types (e.g. Tax) if not defined in structure but global?
                // For now, assume structure defines everything or we add simple tax logic here if "PAYE" is the name

                if (comp.type === 'Earning') {
                    totalAllowances += amount;
                } else if (comp.type === 'Deduction') {
                    totalDeductions += amount;
                }

                payslipComponents.push({
                    name: comp.name,
                    type: comp.type,
                    amount: amount
                });
            }

            // Simple Tax Calculation (Mock logic: if not in structure, maybe add it?)
            // If "Tax" isn't in structure, let's force a calculation for demo?
            // Checking if TAX is already in payslipComponents
            const hasTax = payslipComponents.some(c => c.name.toLowerCase().includes('tax') || c.name.toLowerCase().includes('paye'));
            if (!hasTax) {
                // Mock PAYE: 10% of (Basic + Allowances)
                const taxableIncome = basicSalary + totalAllowances;
                const tax = taxableIncome * 0.10;
                totalDeductions += tax;
                payslipComponents.push({ name: 'PAYE Tax (Auto)', type: 'Deduction', amount: tax });
            }



            const grossSalary = basicSalary + totalAllowances; // Note: Basic is usually part of Gross
            // Wait, "totalAllowances" above included components. If Basic was a component, it might double count?
            // My structure components usually include "Housing", "Transport". Basic is separate.
            // So Gross = Basic + Total Allowances (Earnings).

            const netSalary = grossSalary - totalDeductions;

            runTotalGross += grossSalary;
            runTotalDeductions += totalDeductions;
            runTotalNet += netSalary;

            allPayslips.push({
                employeeId: emp.employee_id,
                basic: basicSalary,
                allowances: totalAllowances,
                deductions: totalDeductions,
                net: netSalary,
                json: payslipComponents
            });
        }

        // 3. Save Run
        const runId = await payrollProcessModel.createPayrollRun(startDate, endDate, runTotalGross, runTotalDeductions, runTotalNet);

        // 4. Save Payslips
        for (const p of allPayslips) {
            await payrollProcessModel.createPayslip(runId, p.employeeId, p.basic, p.allowances, p.deductions, p.net, p.json);
        }

        req.flash('success_msg', 'Payroll processed successfully!');
        res.redirect('/payroll/history');

    } catch (error) {
        console.error(error);
        req.flash('error_msg', 'Error processing payroll: ' + error.message);
        res.redirect('/payroll/run');
    }
};

const printPayslip = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await payrollProcessModel.getPayslipById(id);

        if (result.length === 0) {
            return res.status(404).send('Payslip not found');
        }

        const payslip = result[0];
        // Parse JSON if it's a string
        if (typeof payslip.payslip_json === 'string') {
            payslip.structure = JSON.parse(payslip.payslip_json);
        } else {
            payslip.structure = payslip.payslip_json;
        }

        res.render('payroll/payslip-print', { payslip });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error generating payslip');
    }
};

module.exports = {
    getRunPayrollPage,
    getPayrollHistory,
    viewPayrollRun,
    processPayroll,
    printPayslip
};
