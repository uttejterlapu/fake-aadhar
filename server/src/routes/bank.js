const express = require('express');
const router = express.Router();
const bankAccountController = require('../controllers/bankController'); // Adjust the path as necessary
const apiKeyInUrl = require('../middleware/apiKeyInUrl'); 

router.use(apiKeyInUrl);

// Create a new bank account
router.post('/accounts', bankAccountController.createAccount);

// Update the balance of a bank account
router.put('/accounts/:accountNumber/balance', bankAccountController.updateBalance);

// Apply for a credit card
router.post('/accounts/apply-credit-card/:accountNumber', bankAccountController.applyForCreditCard);

// Get account details
router.get('/accounts/:accountNumber', bankAccountController.getAccountDetails);

// Add a transaction
router.post('/accounts/:accountNumber/transactions', bankAccountController.addTransaction);

// Get mini-statement (recent transactions)
router.get('/accounts/:accountNumber/mini-statement', bankAccountController.getMiniStatement);

module.exports = router;
