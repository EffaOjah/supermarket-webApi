const ledgerModel = require("../models/ledgerModel");

// ==================== ADD LEDGER ENTRY ====================

// Render add ledger entry page
const renderAddEntryPage = async (req, res) => {
    try {
        const accounts = await ledgerModel.getAllAccounts();
        const transactionTypes = await ledgerModel.getAllTransactionTypes();

        res.render("add-ledger-entry", { accounts, transactionTypes, user: req.user });
    } catch (error) {
        console.error("Error rendering add ledger entry page:", error);
        req.flash("error_msg", "Failed to load ledger entry page");
        const redirectUrl = req.user && req.user.role === 'accountant' ? '/accountant/dashboard' : '/admin/dashboard';
        res.redirect(redirectUrl);
    }
};

// Create ledger transaction
const createTransaction = async (req, res) => {
    try {
        const {
            transactionDate,
            transactionType,
            referenceNumber,
            description,
            entries // JSON string of entries
        } = req.body;

        // Validation
        if (!transactionDate || !transactionType || !entries) {
            req.flash("error_msg", "Please fill in all required fields");
            return res.redirect("/ledger/add");
        }

        // Parse entries
        const parsedEntries = JSON.parse(entries);

        if (!parsedEntries || parsedEntries.length < 2) {
            req.flash("error_msg", "At least two entries (debit and credit) are required");
            return res.redirect("/ledger/add");
        }

        // Calculate total amount
        const totalAmount = parsedEntries.reduce((sum, entry) => sum + parseFloat(entry.amount), 0) / 2;

        // Generate transaction ID
        const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

        // Prepare transaction data
        const transactionData = {
            transactionId,
            transactionDate,
            transactionType,
            referenceNumber: referenceNumber || null,
            description,
            description,
            totalAmount,
            createdBy: req.user.email,
            branchId: req.user.branch_id,
            entries: parsedEntries
        };

        // Insert transaction
        await ledgerModel.insertTransaction(transactionData);

        req.flash("success_msg", `Transaction ${transactionId} posted successfully!`);
        res.redirect("/ledger/view");
    } catch (error) {
        console.error("Error creating transaction:", error);
        req.flash("error_msg", error.message || "Failed to create transaction");
        res.redirect("/ledger/add");
    }
};

// ==================== VIEW LEDGER ====================

// Render ledger view page
const renderLedgerView = async (req, res) => {
    try {
        const { startDate, endDate, transactionType, status } = req.query;

        const filters = {
            startDate: startDate || null,
            endDate: endDate || null,
            transactionType: transactionType || null,
            status: status || 'POSTED',
            branchId: req.user.role === 'accountant' ? req.user.branch_id : null
        };

        const transactions = await ledgerModel.getAllTransactions(filters);
        const transactionTypes = await ledgerModel.getAllTransactionTypes();

        res.render("view-ledger", {
            transactions,
            transactionTypes,
            filters,
            user: req.user
        });
    } catch (error) {
        console.error("Error fetching ledger:", error);
        req.flash("error_msg", "Failed to load ledger");
        const redirectUrl = req.user && req.user.role === 'accountant' ? '/accountant/dashboard' : '/admin/dashboard';
        res.redirect(redirectUrl);
    }
};

// View transaction details
const viewTransactionDetails = async (req, res) => {
    try {
        const { transactionId } = req.params;
        const transaction = await ledgerModel.getTransactionById(transactionId);

        if (!transaction) {
            req.flash("error_msg", "Transaction not found");
            return res.redirect("/ledger/view");
        }

        res.render("transaction-details", { transaction, user: req.user });
    } catch (error) {
        console.error("Error fetching transaction:", error);
        req.flash("error_msg", "Failed to load transaction details");
        res.redirect("/ledger/view");
    }
};

// ==================== CHART OF ACCOUNTS ====================

// Render chart of accounts page
const renderChartOfAccounts = async (req, res) => {
    try {
        const accounts = await ledgerModel.getAllAccounts();

        // Group accounts by type
        const groupedAccounts = {
            ASSET: accounts.filter(a => a.account_type === 'ASSET'),
            LIABILITY: accounts.filter(a => a.account_type === 'LIABILITY'),
            EQUITY: accounts.filter(a => a.account_type === 'EQUITY'),
            REVENUE: accounts.filter(a => a.account_type === 'REVENUE'),
            EXPENSE: accounts.filter(a => a.account_type === 'EXPENSE')
        };

        res.render("chart-of-accounts", { accounts, groupedAccounts, user: req.user });
    } catch (error) {
        console.error("Error fetching chart of accounts:", error);
        req.flash("error_msg", "Failed to load chart of accounts");
        const redirectUrl = req.user && req.user.role === 'accountant' ? '/accountant/dashboard' : '/admin/dashboard';
        res.redirect(redirectUrl);
    }
};

// Add new account
const addAccount = async (req, res) => {
    try {
        const { accountCode, accountName, accountType, parentAccount, description } = req.body;

        if (!accountCode || !accountName || !accountType) {
            req.flash("error_msg", "Please fill in all required fields");
            return res.redirect("/ledger/accounts");
        }

        const accountData = {
            accountCode,
            accountName,
            accountType,
            parentAccount: parentAccount || null,
            description: description || null
        };

        await ledgerModel.insertAccount(accountData);

        req.flash("success_msg", "Account added successfully!");
        res.redirect("/ledger/accounts");
    } catch (error) {
        console.error("Error adding account:", error);
        req.flash("error_msg", "Failed to add account. Account code may already exist.");
        res.redirect("/ledger/accounts");
    }
};

// ==================== TRIAL BALANCE ====================

// Render trial balance page
const renderTrialBalance = async (req, res) => {
    try {
        const { asOfDate } = req.query;
        const branchId = req.user.role === 'accountant' ? req.user.branch_id : null;
        const trialBalance = await ledgerModel.getTrialBalance(asOfDate || null, branchId);

        res.render("trial-balance", { trialBalance, user: req.user });
    } catch (error) {
        console.error("Error generating trial balance:", error);
        req.flash("error_msg", "Failed to generate trial balance");
        const redirectUrl = req.user && req.user.role === 'accountant' ? '/accountant/dashboard' : '/admin/dashboard';
        res.redirect(redirectUrl);
    }
};

// ==================== ACCOUNT STATEMENT ====================

// Render account statement
const renderAccountStatement = async (req, res) => {
    try {
        const { accountCode } = req.params;
        const { startDate, endDate } = req.query;

        const account = await ledgerModel.getAccountByCode(accountCode);
        if (!account) {
            req.flash("error_msg", "Account not found");
            return res.redirect("/ledger/accounts");
        }

        const branchId = req.user.role === 'accountant' ? req.user.branch_id : null;
        const balance = await ledgerModel.getAccountBalance(accountCode, endDate || null, branchId);

        res.render("account-statement", {
            account,
            balance,
            startDate,
            endDate,
            user: req.user
        });
    } catch (error) {
        console.error("Error generating account statement:", error);
        req.flash("error_msg", "Failed to generate account statement");
        res.redirect("/ledger/accounts");
    }
};

// ==================== BALANCE SHEET ====================

// Render balance sheet
const renderBalanceSheet = async (req, res) => {
    try {
        const { asOfDate } = req.query;
        const branchId = req.user.role === 'accountant' ? req.user.branch_id : null;
        const balanceSheet = await ledgerModel.getBalanceSheet(asOfDate || null, branchId);

        res.render("balance-sheet", { balanceSheet, user: req.user });
    } catch (error) {
        console.error("Error generating balance sheet:", error);
        req.flash("error_msg", "Failed to generate balance sheet");
        const redirectUrl = req.user && req.user.role === 'accountant' ? '/accountant/dashboard' : '/admin/dashboard';
        res.redirect(redirectUrl);
    }
};

// ==================== PROFIT AND LOSS ====================

// Render Profit and Loss
const renderProfitLoss = async (req, res) => {
    try {
        let { startDate, endDate } = req.query;

        // Default to current month if not provided
        if (!startDate || !endDate) {
            const now = new Date();
            const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
            const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

            startDate = startDate || firstDay.toISOString().split('T')[0];
            endDate = endDate || lastDay.toISOString().split('T')[0];
        }

        const branchId = req.user.role === 'accountant' ? req.user.branch_id : null;
        const report = await ledgerModel.getProfitLoss(startDate, endDate, branchId);

        res.render("profit-loss", { report, user: req.user });
    } catch (error) {
        console.error("Error generating profit and loss report:", error);
        req.flash("error_msg", "Failed to generate profit and loss report");
        const redirectUrl = req.user && req.user.role === 'accountant' ? '/accountant/dashboard' : '/admin/dashboard';
        res.redirect(redirectUrl);
    }
};

module.exports = {
    renderAddEntryPage,
    createTransaction,
    renderLedgerView,
    viewTransactionDetails,
    renderChartOfAccounts,
    addAccount,
    renderTrialBalance,
    renderAccountStatement,
    renderBalanceSheet,
    renderProfitLoss
};
