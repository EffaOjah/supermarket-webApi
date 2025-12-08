const express = require("express");
const router = express.Router();
const ledgerController = require("../controllers/ledgerController");

// ==================== LEDGER ENTRY ROUTES ====================

// Render add ledger entry page
router.get("/ledger/add", ledgerController.renderAddEntryPage);

// Handle ledger entry form submission
router.post("/ledger/add", ledgerController.createTransaction);

// ==================== LEDGER VIEW ROUTES ====================

// Render ledger view page
router.get("/ledger/view", ledgerController.renderLedgerView);

// View transaction details
router.get("/ledger/transaction/:transactionId", ledgerController.viewTransactionDetails);

// ==================== CHART OF ACCOUNTS ROUTES ====================

// Render chart of accounts page
router.get("/ledger/accounts", ledgerController.renderChartOfAccounts);

// Add new account
router.post("/ledger/accounts/add", ledgerController.addAccount);

// ==================== REPORTS ROUTES ====================

// Render trial balance
router.get("/ledger/trial-balance", ledgerController.renderTrialBalance);

// Render balance sheet
router.get("/ledger/balance-sheet", ledgerController.renderBalanceSheet);

// Render profit and loss
router.get("/ledger/profit-loss", ledgerController.renderProfitLoss);

// Render account statement
router.get("/ledger/account-statement/:accountCode", ledgerController.renderAccountStatement);

module.exports = router;
