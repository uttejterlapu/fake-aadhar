const BankAccount = require('../models/bank'); // Adjust the path as necessary
const Aadhaar = require('../models/aadhaar');
const Pan = require('../models/pan');
// Create a new bank account
module.exports.createAccount = async (req, res) => {
    try {
        const { email, aadhaarNumber, panNumber } = req.body;
        const isAadhaarExist = await Aadhaar.findOne({ aadhaarNumber: aadhaarNumber });
        if (!isAadhaarExist) {
            return res.status(404).json({ message: 'Aadhaar not Exist' });
        }
        const isPanExist = await Pan.findOne({ panNumber: panNumber });
        if (!isPanExist) {
            return res.status(404).json({ message: 'Pan not Exist' });
        }
        if (aadhaarNumber !== isPanExist.aadhaarNumber) {
            return res.status(404).json({ message: 'Pan not related to provied Aadhaar' });
        }
        const name = isAadhaarExist.firstName + isAadhaarExist.lastName;
        const newAccount = new BankAccount({
            name,
            email,
            aadhaarNumber,
            panNumber
        });
        await newAccount.save();
        res.status(201).json({ message: 'Bank account created successfully', account: newAccount });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update the balance of a bank account
module.exports.updateBalance = async (req, res) => {
    try {
        const { accountNumber } = req.params;
        const { amount, type, description } = req.body;
        const account = await BankAccount.findOne({ accountNumber });

        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }

        await account.updateBalance(amount, type, description);
        res.status(200).json({ message: 'Balance updated successfully', account });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Apply for a credit card
module.exports.applyForCreditCard = async (req, res) => {
    try {
        const account = await BankAccount.findOne({accountNumber: req.params.accountNumber});
        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }

        await account.applyForCreditCard();
        res.status(200).json({ message: 'Credit card applied successfully', creditCard: account.creditCard });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get account details
module.exports.getAccountDetails = async (req, res) => {
    try {
        const { accountNumber } = req.params;
        const account = await BankAccount.findOne({ accountNumber });

        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }

        res.status(200).json({ account });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Add a transaction
module.exports.addTransaction = async (req, res) => {
    try {
        const { accountNumber } = req.params;
        const { type, amount, description } = req.body;
        const account = await BankAccount.findOne({ accountNumber });

        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }

        await account.updateBalance(amount, type, description);
        res.status(200).json({ message: 'Transaction added successfully', account });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get mini-statement (recent transactions)
module.exports.getMiniStatement = async (req, res) => {
    try {
        const { accountNumber } = req.params;
        const account = await BankAccount.findOne({ accountNumber }).select('transactions');

        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }

        // Retrieve the most recent 10 transactions
        const recentTransactions = account.transactions.slice(-10);

        res.status(200).json({ miniStatement: recentTransactions });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
