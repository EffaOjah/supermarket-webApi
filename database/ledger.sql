-- General Ledger System Database Schema (MySQL)

-- Chart of Accounts Table
CREATE TABLE IF NOT EXISTS chart_of_accounts (
    account_code VARCHAR(20) NOT NULL UNIQUE PRIMARY KEY,
    account_name VARCHAR(255) NOT NULL,
    account_type ENUM('ASSET', 'LIABILITY', 'EQUITY', 'REVENUE', 'EXPENSE') NOT NULL,
    parent_account VARCHAR(20),
    description TEXT,
    is_active TINYINT(1) DEFAULT 1,
    opening_balance DECIMAL(15, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_account) REFERENCES chart_of_accounts(account_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Transaction Types Table
CREATE TABLE IF NOT EXISTS transaction_types (
    type_code VARCHAR(20) NOT NULL UNIQUE PRIMARY KEY,
    type_name VARCHAR(100) NOT NULL,
    description TEXT,
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Ledger Transactions Table (Header)
CREATE TABLE IF NOT EXISTS ledger_transactions (
    transaction_id VARCHAR(50) NOT NULL UNIQUE PRIMARY KEY,
    transaction_date DATE NOT NULL,
    transaction_type VARCHAR(20) NOT NULL,
    reference_number VARCHAR(100),
    description TEXT,
    total_amount DECIMAL(15, 2) NOT NULL,
    status ENUM('DRAFT', 'POSTED', 'VOID') DEFAULT 'POSTED',
    created_by VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    posted_at TIMESTAMP NULL,
    voided_at TIMESTAMP NULL,
    FOREIGN KEY (transaction_type) REFERENCES transaction_types(type_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Ledger Entries Table (Details - Double Entry)
CREATE TABLE IF NOT EXISTS ledger_entries (
    entry_id VARCHAR(50) NOT NULL UNIQUE PRIMARY KEY,
    transaction_id VARCHAR(50) NOT NULL,
    account_code VARCHAR(20) NOT NULL,
    entry_type ENUM('DEBIT', 'CREDIT') NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    description TEXT,
    entry_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (transaction_id) REFERENCES ledger_transactions(transaction_id),
    FOREIGN KEY (account_code) REFERENCES chart_of_accounts(account_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create indexes for better query performance
CREATE INDEX idx_ledger_entries_transaction ON ledger_entries(transaction_id);
CREATE INDEX idx_ledger_entries_account ON ledger_entries(account_code);
CREATE INDEX idx_ledger_entries_date ON ledger_entries(entry_date);
CREATE INDEX idx_ledger_transactions_date ON ledger_transactions(transaction_date);
CREATE INDEX idx_ledger_transactions_type ON ledger_transactions(transaction_type);
CREATE INDEX idx_chart_of_accounts_type ON chart_of_accounts(account_type);

-- Insert Default Chart of Accounts
-- ASSETS (1000-1999)
INSERT IGNORE INTO chart_of_accounts (account_code, account_name, account_type, description) VALUES
('1000', 'Cash', 'ASSET', 'Cash on hand and in bank'),
('1100', 'Accounts Receivable', 'ASSET', 'Money owed by customers'),
('1200', 'Inventory', 'ASSET', 'Stock of goods for sale'),
('1300', 'Prepaid Expenses', 'ASSET', 'Expenses paid in advance'),
('1400', 'Fixed Assets', 'ASSET', 'Long-term tangible assets'),
('1410', 'Equipment', 'ASSET', 'Business equipment and machinery'),
('1420', 'Furniture & Fixtures', 'ASSET', 'Office furniture and fixtures'),
('1430', 'Vehicles', 'ASSET', 'Company vehicles'),
('1500', 'Accumulated Depreciation', 'ASSET', 'Contra-asset account for depreciation');

-- LIABILITIES (2000-2999)
INSERT IGNORE INTO chart_of_accounts (account_code, account_name, account_type, description) VALUES
('2000', 'Accounts Payable', 'LIABILITY', 'Money owed to suppliers'),
('2100', 'Salaries Payable', 'LIABILITY', 'Unpaid employee salaries'),
('2200', 'Tax Payable', 'LIABILITY', 'Taxes owed to government'),
('2210', 'Sales Tax Payable', 'LIABILITY', 'Sales tax collected from customers'),
('2220', 'Income Tax Payable', 'LIABILITY', 'Income tax owed'),
('2300', 'Loans Payable', 'LIABILITY', 'Bank loans and other borrowings'),
('2400', 'Accrued Expenses', 'LIABILITY', 'Expenses incurred but not yet paid');

-- EQUITY (3000-3999)
INSERT IGNORE INTO chart_of_accounts (account_code, account_name, account_type, description) VALUES
('3000', 'Owner''s Capital', 'EQUITY', 'Owner''s investment in business'),
('3100', 'Retained Earnings', 'EQUITY', 'Accumulated profits'),
('3200', 'Drawings', 'EQUITY', 'Owner''s withdrawals');

-- REVENUE (4000-4999)
INSERT IGNORE INTO chart_of_accounts (account_code, account_name, account_type, description) VALUES
('4000', 'Sales Revenue', 'REVENUE', 'Revenue from product sales'),
('4100', 'Service Revenue', 'REVENUE', 'Revenue from services'),
('4200', 'Other Income', 'REVENUE', 'Miscellaneous income'),
('4300', 'Interest Income', 'REVENUE', 'Interest earned on deposits');

-- EXPENSES (5000-5999)
INSERT IGNORE INTO chart_of_accounts (account_code, account_name, account_type, description) VALUES
('5000', 'Cost of Goods Sold', 'EXPENSE', 'Direct cost of products sold'),
('5100', 'Salary Expense', 'EXPENSE', 'Employee salaries and wages'),
('5200', 'Rent Expense', 'EXPENSE', 'Rent for business premises'),
('5300', 'Utilities Expense', 'EXPENSE', 'Electricity, water, internet'),
('5400', 'Office Supplies Expense', 'EXPENSE', 'Office supplies and materials'),
('5500', 'Depreciation Expense', 'EXPENSE', 'Depreciation of fixed assets'),
('5600', 'Insurance Expense', 'EXPENSE', 'Business insurance premiums'),
('5700', 'Marketing Expense', 'EXPENSE', 'Advertising and marketing costs'),
('5800', 'Bank Charges', 'EXPENSE', 'Bank fees and charges'),
('5900', 'Miscellaneous Expense', 'EXPENSE', 'Other operating expenses');

-- Insert Default Transaction Types
INSERT IGNORE INTO transaction_types (type_code, type_name, description) VALUES
('SALE', 'Sales Transaction', 'Revenue from sales of goods or services'),
('PAYMENT_IN', 'Payment Received', 'Cash or payment received from customers'),
('PAYMENT_OUT', 'Payment Made', 'Cash or payment made to suppliers'),
('SALARY', 'Salary Payment', 'Payment of employee salaries'),
('PAYROLL', 'Payroll Processing', 'Processing of payroll with deductions'),
('PURCHASE', 'Purchase Transaction', 'Purchase of goods or services'),
('EXPENSE', 'General Expense', 'Recording of business expenses'),
('ASSET_PURCHASE', 'Asset Purchase', 'Purchase of fixed assets'),
('DEPRECIATION', 'Depreciation Entry', 'Recording asset depreciation'),
('JOURNAL', 'Journal Entry', 'General journal entry'),
('OPENING_BALANCE', 'Opening Balance', 'Opening balance entry'),
('ADJUSTMENT', 'Adjustment Entry', 'Correcting or adjusting entry');
