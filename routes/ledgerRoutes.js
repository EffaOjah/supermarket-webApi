const express = require("express");
const router = express.Router();
const ledgerController = require("../controllers/ledgerController");
const { requireRole } = require('../middleware/roleAuth');

// ==================== LEDGER ENTRY ROUTES ====================

// Render add ledger entry page
router.get("/ledger/add", requireRole(['admin', 'accountant']), ledgerController.renderAddEntryPage);

// Handle ledger entry form submission
router.post("/ledger/add", requireRole(['admin', 'accountant']), ledgerController.createTransaction);

// ==================== LEDGER VIEW ROUTES ====================

// Render ledger view page
router.get("/ledger/view", requireRole(['admin', 'accountant']), ledgerController.renderLedgerView);

// View transaction details
router.get("/ledger/transaction/:transactionId", requireRole(['admin', 'accountant']), ledgerController.viewTransactionDetails);

// ==================== CHART OF ACCOUNTS ROUTES ====================

// Render chart of accounts page
router.get("/ledger/accounts", requireRole(['admin', 'accountant']), ledgerController.renderChartOfAccounts);

// Add new account
router.post("/ledger/accounts/add", requireRole(['admin', 'accountant']), ledgerController.addAccount);

// ==================== REPORTS ROUTES ====================

// Render trial balance
router.get("/ledger/trial-balance", requireRole(['admin', 'accountant']), ledgerController.renderTrialBalance);

// Render balance sheet
router.get("/ledger/balance-sheet", requireRole(['admin', 'accountant']), ledgerController.renderBalanceSheet);

// Render profit and loss
router.get("/ledger/profit-loss", requireRole(['admin', 'accountant']), ledgerController.renderProfitLoss);

// Render account statement
router.get("/ledger/account-statement/:accountCode", requireRole(['admin', 'accountant']), ledgerController.renderAccountStatement);

module.exports = router;
