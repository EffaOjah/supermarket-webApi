const db = require("../config/dbConfig");

// ==================== CHART OF ACCOUNTS ====================

// Get all accounts
const getAllAccounts = async () => {
    return new Promise((resolve, reject) => {
        db.query(
            "SELECT * FROM chart_of_accounts WHERE is_active = 1 ORDER BY account_code",
            (err, result) => {
                if (err) reject(err);
                resolve(result);
            }
        );
    });
};

// Get accounts by type
const getAccountsByType = async (accountType) => {
    return new Promise((resolve, reject) => {
        db.query(
            "SELECT * FROM chart_of_accounts WHERE account_type = ? AND is_active = 1 ORDER BY account_code",
            [accountType],
            (err, result) => {
                if (err) reject(err);
                resolve(result);
            }
        );
    });
};

// Get account by code
const getAccountByCode = async (accountCode) => {
    return new Promise((resolve, reject) => {
        db.query(
            "SELECT * FROM chart_of_accounts WHERE account_code = ?",
            [accountCode],
            (err, result) => {
                if (err) reject(err);
                resolve(result[0]);
            }
        );
    });
};

// Insert new account
const insertAccount = async (accountData) => {
    return new Promise((resolve, reject) => {
        const { accountCode, accountName, accountType, parentAccount, description } = accountData;

        db.query(
            `INSERT INTO chart_of_accounts (account_code, account_name, account_type, parent_account, description) 
       VALUES (?, ?, ?, ?, ?)`,
            [accountCode, accountName, accountType, parentAccount, description],
            (err, result) => {
                if (err) reject(err);
                resolve(result);
            }
        );
    });
};

// ==================== TRANSACTION TYPES ====================

// Get all transaction types
const getAllTransactionTypes = async () => {
    return new Promise((resolve, reject) => {
        db.query(
            "SELECT * FROM transaction_types WHERE is_active = 1 ORDER BY type_name",
            (err, result) => {
                if (err) reject(err);
                resolve(result);
            }
        );
    });
};

// ==================== LEDGER TRANSACTIONS ====================

// Insert transaction with entries (Double Entry)
const insertTransaction = async (transactionData) => {
    return new Promise((resolve, reject) => {
        const {
            transactionId,
            transactionDate,
            transactionType,
            referenceNumber,
            description,
            totalAmount,
            createdBy,
            branchId,
            entries // Array of {accountCode, entryType, amount, description}
        } = transactionData;

        // Validate double-entry: total debits must equal total credits
        const totalDebits = entries
            .filter(e => e.entryType === 'DEBIT')
            .reduce((sum, e) => sum + parseFloat(e.amount), 0);

        const totalCredits = entries
            .filter(e => e.entryType === 'CREDIT')
            .reduce((sum, e) => sum + parseFloat(e.amount), 0);

        if (Math.abs(totalDebits - totalCredits) > 0.01) {
            return reject(new Error('Debits must equal credits'));
        }

        // Begin transaction
        db.query("START TRANSACTION", (err) => {
            if (err) return reject(err);

            // Insert transaction header
            db.query(
                `INSERT INTO ledger_transactions 
         (transaction_id, transaction_date, transaction_type, reference_number, description, total_amount, created_by, branch_id, posted_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
                [transactionId, transactionDate, transactionType, referenceNumber, description, totalAmount, createdBy, branchId],
                (err) => {
                    if (err) {
                        db.query("ROLLBACK");
                        return reject(err);
                    }

                    // Insert all entries
                    let completed = 0;
                    entries.forEach((entry, index) => {
                        const entryId = `${transactionId}-E${index + 1}`;

                        db.query(
                            `INSERT INTO ledger_entries 
               (entry_id, transaction_id, account_code, entry_type, amount, description, entry_date) 
               VALUES (?, ?, ?, ?, ?, ?, ?)`,
                            [entryId, transactionId, entry.accountCode, entry.entryType, entry.amount, entry.description, transactionDate],
                            (err) => {
                                if (err) {
                                    db.query("ROLLBACK");
                                    return reject(err);
                                }

                                completed++;
                                if (completed === entries.length) {
                                    db.query("COMMIT", (err) => {
                                        if (err) return reject(err);
                                        resolve({ transactionId, message: 'Transaction posted successfully' });
                                    });
                                }
                            }
                        );
                    });
                }
            );
        });
    });
};

// Get all transactions
const getAllTransactions = async (filters = {}) => {
    return new Promise((resolve, reject) => {
        let query = `
      SELECT t.*, tt.type_name 
      FROM ledger_transactions t
      LEFT JOIN transaction_types tt ON t.transaction_type = tt.type_code
      WHERE 1=1
    `;
        const params = [];

        if (filters.startDate) {
            query += " AND t.transaction_date >= ?";
            params.push(filters.startDate);
        }

        if (filters.branchId) {
            query += " AND t.branch_id = ?";
            params.push(filters.branchId);
        }

        if (filters.endDate) {
            query += " AND t.transaction_date <= ?";
            params.push(filters.endDate);
        }

        if (filters.transactionType) {
            query += " AND t.transaction_type = ?";
            params.push(filters.transactionType);
        }

        if (filters.status) {
            query += " AND t.status = ?";
            params.push(filters.status);
        }

        query += " ORDER BY t.transaction_date DESC, t.created_at DESC";

        db.query(query, params, (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
};

// Get transaction by ID with entries
const getTransactionById = async (transactionId) => {
    return new Promise((resolve, reject) => {
        // Get transaction header
        db.query(
            "SELECT * FROM ledger_transactions WHERE transaction_id = ?",
            [transactionId],
            (err, transaction) => {
                if (err) return reject(err);
                if (!transaction || transaction.length === 0) {
                    return resolve(null);
                }

                // Get transaction entries
                db.query(
                    `SELECT e.*, a.account_name 
           FROM ledger_entries e
           LEFT JOIN chart_of_accounts a ON e.account_code = a.account_code
           WHERE e.transaction_id = ?
           ORDER BY e.entry_type DESC, e.entry_id`,
                    [transactionId],
                    (err, entries) => {
                        if (err) return reject(err);
                        resolve({
                            ...transaction[0],
                            entries: entries
                        });
                    }
                );
            }
        );
    });
};

// Get account balance
const getAccountBalance = async (accountCode, asOfDate = null, branchId = null) => {
    return new Promise((resolve, reject) => {
        let query = `
      SELECT 
        SUM(CASE WHEN e.entry_type = 'DEBIT' THEN e.amount ELSE 0 END) as total_debits,
        SUM(CASE WHEN e.entry_type = 'CREDIT' THEN e.amount ELSE 0 END) as total_credits
      FROM ledger_entries e
      JOIN ledger_transactions t ON e.transaction_id = t.transaction_id
      WHERE e.account_code = ?
    `;
        const params = [accountCode];

        if (asOfDate) {
            query += " AND e.entry_date <= ?";
            params.push(asOfDate);
        }

        if (branchId) {
            query += " AND t.branch_id = ?";
            params.push(branchId);
        }




        db.query(query, params, async (err, result) => {
            if (err) return reject(err);

            const debits = result[0]?.total_debits || 0;
            const credits = result[0]?.total_credits || 0;

            // Get account type to determine normal balance
            const account = await getAccountByCode(accountCode);
            const accountType = account?.account_type;

            // Calculate balance based on account type
            let balance = 0;
            if (['ASSET', 'EXPENSE'].includes(accountType)) {
                balance = debits - credits; // Normal debit balance
            } else {
                balance = credits - debits; // Normal credit balance
            }

            resolve({
                accountCode,
                accountName: account?.account_name,
                accountType,
                totalDebits: debits,
                totalCredits: credits,
                balance: balance
            });
        });
    });
};

// Get trial balance
const getTrialBalance = async (asOfDate = null, branchId = null) => {
    return new Promise((resolve, reject) => {
        getAllAccounts().then(accounts => {
            const balancePromises = accounts.map(account =>
                getAccountBalance(account.account_code, asOfDate, branchId)
            );

            Promise.all(balancePromises).then(balances => {
                const totalDebits = balances
                    .filter(b => b.balance > 0 && ['ASSET', 'EXPENSE'].includes(b.accountType))
                    .reduce((sum, b) => sum + b.balance, 0);

                const totalCredits = balances
                    .filter(b => b.balance > 0 && ['LIABILITY', 'EQUITY', 'REVENUE'].includes(b.accountType))
                    .reduce((sum, b) => sum + b.balance, 0);

                resolve({
                    balances: balances.filter(b => Math.abs(b.balance) > 0.01),
                    totalDebits,
                    totalCredits,
                    difference: totalDebits - totalCredits,
                    asOfDate: asOfDate || new Date().toISOString().split('T')[0]
                });
            }).catch(reject);
        }).catch(reject);
    });
};

// Get balance sheet
const getBalanceSheet = async (asOfDate = null, branchId = null) => {
    return new Promise((resolve, reject) => {
        getAllAccounts().then(accounts => {
            // Group accounts by type
            const assetAccounts = accounts.filter(a => a.account_type === 'ASSET');
            const liabilityAccounts = accounts.filter(a => a.account_type === 'LIABILITY');
            const equityAccounts = accounts.filter(a => a.account_type === 'EQUITY');

            // Get balances for all accounts
            const assetBalancePromises = assetAccounts.map(account =>
                getAccountBalance(account.account_code, asOfDate, branchId)
            );
            const liabilityBalancePromises = liabilityAccounts.map(account =>
                getAccountBalance(account.account_code, asOfDate, branchId)
            );
            const equityBalancePromises = equityAccounts.map(account =>
                getAccountBalance(account.account_code, asOfDate, branchId)
            );

            Promise.all([
                Promise.all(assetBalancePromises),
                Promise.all(liabilityBalancePromises),
                Promise.all(equityBalancePromises)
            ]).then(([assetBalances, liabilityBalances, equityBalances]) => {
                // Filter out zero balances and calculate totals
                const assets = {
                    accounts: assetBalances.filter(b => Math.abs(b.balance) > 0.01),
                    total: assetBalances.reduce((sum, b) => sum + b.balance, 0)
                };

                const liabilities = {
                    accounts: liabilityBalances.filter(b => Math.abs(b.balance) > 0.01),
                    total: liabilityBalances.reduce((sum, b) => sum + b.balance, 0)
                };

                const equity = {
                    accounts: equityBalances.filter(b => Math.abs(b.balance) > 0.01),
                    total: equityBalances.reduce((sum, b) => sum + b.balance, 0)
                };

                // Calculate accounting equation
                const totalLiabilitiesAndEquity = liabilities.total + equity.total;
                const difference = assets.total - totalLiabilitiesAndEquity;
                const isBalanced = Math.abs(difference) < 0.01;

                resolve({
                    asOfDate: asOfDate || new Date().toISOString().split('T')[0],
                    assets,
                    liabilities,
                    equity,
                    totalLiabilitiesAndEquity,
                    isBalanced,
                    difference
                });
            }).catch(reject);
        }).catch(reject);
    });
};

// Void transaction
const voidTransaction = async (transactionId) => {
    return new Promise((resolve, reject) => {
        db.query(
            "UPDATE ledger_transactions SET status = 'VOID', voided_at = CURRENT_TIMESTAMP WHERE transaction_id = ?",
            [transactionId],
            (err, result) => {
                if (err) reject(err);
                resolve(result);
            }
        );
    });
};

// Get Profit and Loss
const getProfitLoss = async (startDate, endDate, branchId = null) => {
    return new Promise((resolve, reject) => {
        getAllAccounts().then(accounts => {
            // Group accounts
            const revenueAccounts = accounts.filter(a => a.account_type === 'REVENUE');
            const expenseAccounts = accounts.filter(a => a.account_type === 'EXPENSE');

            // Helper to get balance for a period (Movement only)
            const getPeriodBalance = (accountCode) => {
                return new Promise((resolveBalance, rejectBalance) => {
                    let query = `
        SELECT
        SUM(CASE WHEN e.entry_type = 'DEBIT' THEN e.amount ELSE 0 END) as total_debits,
            SUM(CASE WHEN e.entry_type = 'CREDIT' THEN e.amount ELSE 0 END) as total_credits
                        FROM ledger_entries e
                        JOIN ledger_transactions t ON e.transaction_id = t.transaction_id
                        WHERE e.account_code = ? AND e.entry_date >= ? AND e.entry_date <= ?
            `;
                    const params = [accountCode, startDate, endDate];

                    if (branchId) {
                        query += " AND t.branch_id = ?";
                        params.push(branchId);
                    }

                    db.query(query, params, (err, result) => {
                        if (err) return rejectBalance(err);
                        const debits = result[0]?.total_debits || 0;
                        const credits = result[0]?.total_credits || 0;
                        resolveBalance({ debits, credits });
                    });
                });
            };

            const revPromises = revenueAccounts.map(a => getPeriodBalance(a.account_code)
                .then(b => ({ ...a, ...b, net: b.credits - b.debits }))); // Revenue is Credit normal

            const expPromises = expenseAccounts.map(a => getPeriodBalance(a.account_code)
                .then(b => ({ ...a, ...b, net: b.debits - b.credits }))); // Expense is Debit normal

            Promise.all([Promise.all(revPromises), Promise.all(expPromises)])
                .then(([revResults, expResults]) => {
                    // Filter out zero movement accounts
                    const activeRevenue = revResults.filter(a => Math.abs(a.net) > 0.01);
                    const activeExpenses = expResults.filter(a => Math.abs(a.net) > 0.01);

                    const totalRevenue = activeRevenue.reduce((sum, a) => sum + a.net, 0);

                    // Separate COGS (Account 5000)
                    const cogsAccounts = activeExpenses.filter(a => a.account_code.toString() === '5000');
                    const operatingExpenses = activeExpenses.filter(a => a.account_code.toString() !== '5000');

                    const totalCOGS = cogsAccounts.reduce((sum, a) => sum + a.net, 0);
                    const totalOpExpenses = operatingExpenses.reduce((sum, a) => sum + a.net, 0);

                    const grossProfit = totalRevenue - totalCOGS;
                    const netProfit = grossProfit - totalOpExpenses;

                    resolve({
                        startDate,
                        endDate,
                        revenue: { accounts: activeRevenue, total: totalRevenue },
                        cogs: { accounts: cogsAccounts, total: totalCOGS },
                        grossProfit,
                        expenses: { accounts: operatingExpenses, total: totalOpExpenses },
                        netProfit
                    });
                }).catch(reject);

        }).catch(reject);
    });
};

module.exports = {
    // Chart of Accounts
    getAllAccounts,
    getAccountsByType,
    getAccountByCode,
    insertAccount,

    // Transaction Types
    getAllTransactionTypes,

    // Ledger Transactions
    insertTransaction,
    getAllTransactions,
    getTransactionById,
    getAccountBalance,
    getTrialBalance,
    getBalanceSheet,
    getProfitLoss,
    voidTransaction
};
