-- Disable foreign key checks to allow dropping tables
SET FOREIGN_KEY_CHECKS = 0;

-- Rename existing payroll table if it exists (for backup), or drop if it's just garbage
-- We will assume we want to start fresh with a clean 'employees' table but keep the old one as backup
RENAME TABLE payroll TO payroll_backup_legacy;

-- 1. Employees Table (Replaces old payroll table)
CREATE TABLE IF NOT EXISTS employees (
    employee_id INT AUTO_INCREMENT PRIMARY KEY,
    staff_id VARCHAR(50) UNIQUE NOT NULL, -- Internal ID like EMP001
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    date_of_birth DATE,
    date_of_joining DATE,
    department VARCHAR(100),
    job_role VARCHAR(100),
    employment_status ENUM('Active', 'Terminated', 'On Leave') DEFAULT 'Active',
    
    -- Bank Details
    bank_name VARCHAR(100),
    account_number VARCHAR(20),
    account_name VARCHAR(150),
    
    -- Tax/Pension IDs
    tax_id VARCHAR(50),
    pension_id VARCHAR(50),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Salary Structures (Grades)
CREATE TABLE IF NOT EXISTS salary_structures (
    structure_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL, -- e.g., "Level 1", "Manager", "Intern"
    description TEXT,
    frequency ENUM('Monthly', 'Weekly', 'Daily') DEFAULT 'Monthly',
    currency VARCHAR(10) DEFAULT 'NGN',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Salary Components (Allowances & Deductions)
CREATE TABLE IF NOT EXISTS salary_components (
    component_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL, -- e.g., "Basic Salary", "Housing", "Tax", "Loan"
    type ENUM('Earning', 'Deduction') NOT NULL,
    is_taxable BOOLEAN DEFAULT TRUE,
    is_fixed BOOLEAN DEFAULT TRUE, -- TRUE if it's a fixed amount, FALSE if calculated (like tax)
    active BOOLEAN DEFAULT TRUE
);

-- 4. Employee Salary Configuration (Linking Emp to Structure & Overrides)
CREATE TABLE IF NOT EXISTS employee_salary_config (
    config_id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT NOT NULL,
    structure_id INT, -- Optional, if they belong to a standard grade
    
    -- Base Basic Salary (can be part of structure or overridden)
    basic_salary DECIMAL(15, 2) DEFAULT 0.00,
    
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id) ON DELETE CASCADE,
    FOREIGN KEY (structure_id) REFERENCES salary_structures(structure_id)
);

-- 5. Structure Components (Default values for a Grade)
CREATE TABLE IF NOT EXISTS salary_structure_components (
    id INT AUTO_INCREMENT PRIMARY KEY,
    structure_id INT NOT NULL,
    component_id INT NOT NULL,
    default_amount DECIMAL(15, 2) DEFAULT 0.00,
    percentage_of_basic DECIMAL(5, 2) DEFAULT 0.00, -- e.g., Housing is 20% of Basic
    
    FOREIGN KEY (structure_id) REFERENCES salary_structures(structure_id) ON DELETE CASCADE,
    FOREIGN KEY (component_id) REFERENCES salary_components(component_id)
);

-- 6. Attendance & Time Tracking
CREATE TABLE IF NOT EXISTS attendance (
    attendance_id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT NOT NULL,
    date DATE NOT NULL,
    clock_in DATETIME,
    clock_out DATETIME,
    status ENUM('Present', 'Absent', 'Leave', 'Holiday') DEFAULT 'Present',
    overtime_hours DECIMAL(5, 2) DEFAULT 0.00,
    
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id) ON DELETE CASCADE
);

-- 7. Payroll Runs (History of generated payrolls)
CREATE TABLE IF NOT EXISTS payroll_runs (
    run_id INT AUTO_INCREMENT PRIMARY KEY,
    pay_period_start DATE NOT NULL,
    pay_period_end DATE NOT NULL,
    run_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    total_gross DECIMAL(15, 2),
    total_deductions DECIMAL(15, 2),
    total_net DECIMAL(15, 2),
    status ENUM('Draft', 'Approved', 'Paid') DEFAULT 'Draft',
    approved_by VARCHAR(100) -- Admin ID or Name
);

-- 8. Payslips (Individual records)
CREATE TABLE IF NOT EXISTS payslips (
    payslip_id INT AUTO_INCREMENT PRIMARY KEY,
    run_id INT NOT NULL,
    employee_id INT NOT NULL,
    
    basic_salary DECIMAL(15, 2),
    total_allowances DECIMAL(15, 2),
    total_deductions DECIMAL(15, 2),
    net_salary DECIMAL(15, 2),
    
    payslip_json JSON, -- Snapshot of all components for display
    
    FOREIGN KEY (run_id) REFERENCES payroll_runs(run_id) ON DELETE CASCADE,
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id) ON DELETE CASCADE
);

-- 9. Loans & Advances
CREATE TABLE IF NOT EXISTS loans (
    loan_id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    monthly_repayment DECIMAL(15, 2) NOT NULL,
    balance DECIMAL(15, 2) NOT NULL,
    reason TEXT,
    status ENUM('Active', 'Paid', 'Cancelled') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id)
);

SET FOREIGN_KEY_CHECKS = 1;

-- Seed some default components
INSERT INTO salary_components (name, type, is_taxable) VALUES 
('Basic Salary', 'Earning', TRUE),
('Housing Allowance', 'Earning', TRUE),
('Transport Allowance', 'Earning', TRUE),
('Medical Allowance', 'Earning', TRUE),
('Overtime', 'Earning', TRUE),
('PAYE Tax', 'Deduction', FALSE),
('Pension', 'Deduction', FALSE),
('Loan Repayment', 'Deduction', FALSE);
