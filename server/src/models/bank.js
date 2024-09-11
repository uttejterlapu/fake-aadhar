const mongoose = require('mongoose');
const crypto = require('crypto'); // For generating account numbers and card numbers

// List of banks
const bankNames = [
    'State Bank of India (SBI)',
    'HDFC Bank',
    'ICICI Bank',
    'Axis Bank',
    'Punjab National Bank (PNB)'
];

// Helper function to generate a unique account number
const generateAccountNumber = () => {
    return 'ACC' + crypto.randomBytes(4).toString('hex').toUpperCase();
};

// Helper function to generate a debit card number
const generateCardNumber = () => {
    return 'DEBIT' + crypto.randomBytes(4).toString('hex').toUpperCase();
};

// Helper function to generate a random IFSC code
const generateIfscCode = () => {
    const bankCode = crypto.randomBytes(3).toString('hex').toUpperCase();
    const branchCode = crypto.randomBytes(3).toString('hex').toUpperCase();
    return `${bankCode}${branchCode}`;
};

// Helper function to generate a random expiration date
const generateExpirationDate = () => {
    const year = new Date().getFullYear() + 3; // Expires in 3 years
    const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
    return `${month}/${year}`;
};

// Helper function to generate a random CVV
const generateCVV = () => {
    return Math.floor(100 + Math.random() * 900).toString(); // 3-digit CVV
};

// Helper function to generate a random PIN
const generatePIN = () => {
    return Math.floor(1000 + Math.random() * 9000).toString(); // 4-digit PIN
};

// Helper function to generate a credit card number
const generateCreditCardNumber = () => {
    return 'CREDIT' + crypto.randomBytes(4).toString('hex').toUpperCase();
};

// Helper function to get a random bank name
const getRandomBankName = () => {
    return bankNames[Math.floor(Math.random() * bankNames.length)];
};

// Schema for the BankAccount
const bankAccountSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    aadhaarNumber: {
        type: String,
        required: true,
        unique: true
    },
    bankName: {
        type: String,
        default: getRandomBankName // Randomly assign a bank name
    },
    accountNumber: {
        type: String,
        default: generateAccountNumber
    },
    ifscCode: {
        type: String,
        default: generateIfscCode
    },
    balance: {
        type: Number,
        default: 500
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    // PAN Number
    panNumber: {
        type: String,
        default: ''
    },
    // Debit Card Information
    debitCard: {
        number: {
            type: String,
            default: generateCardNumber
        },
        expirationDate: {
            type: String,
            default: generateExpirationDate
        },
        cvv: {
            type: String,
            default: generateCVV
        },
        pin: {
            type: String,
            default: generatePIN
        }
    },
    // Created Status
    createdStatus: {
        type: Boolean,
        default: false
    },
    // Credit Card Information
    creditCard: {
        number: {
            type: String,
            default: ''
        },
        expirationDate: {
            type: String,
            default: ''
        },
        cvv: {
            type: String,
            default: ''
        },
        pin: {
            type: String,
            default: ''
        },
        issued: {
            type: Boolean,
            default: false
        },
        limit: {
            type: Number,
            default: 50000 // Initial credit limit of 50,000
        }
    },
    // Transaction History
    transactions: [{
        type: new mongoose.Schema({
            type: {
                type: String, // e.g., 'credit', 'debit'
                enum: ['credit', 'debit'],
                required: true
            },
            amount: {
                type: Number,
                required: true
            },
            date: {
                type: Date,
                default: Date.now
            },
            description: {
                type: String,
                default: ''
            }
        }, { _id: false })
    }],
    // Credit Card Usage Tracking
    creditCardUsage: {
        totalSpent: {
            type: Number,
            default: 0
        },
        remainingLimit: {
            type: Number,
            default: 50000 // Initial limit
        },
    }
});

// Schema methods for real-time operations
bankAccountSchema.methods.updateBalance = async function (amount, type, description = '') {
    if (type === 'debit' && amount > this.balance) {
        throw new Error('Insufficient funds');
    }

    this.balance += type === 'credit' ? amount : -amount;
    this.transactions.push({ type, amount, description });

    if (this.creditCard.issued && type === 'credit') {
        this.creditCardUsage.totalSpent += amount;
        this.creditCardUsage.remainingLimit = this.creditCard.limit - this.creditCardUsage.totalSpent;
    }

    await this.save();
};

// Method to apply for a credit card
bankAccountSchema.methods.applyForCreditCard = async function () {
    if (this.createdStatus) {
        throw new Error('Credit card already applied for.');
    }

    // Set createdStatus to true
    this.createdStatus = true;

    // Generate new credit card details
    this.creditCard.number = generateCreditCardNumber();
    this.creditCard.expirationDate = generateExpirationDate();
    this.creditCard.cvv = generateCVV();
    this.creditCard.pin = generatePIN();
    this.creditCard.issued = true; // Mark the credit card as issued

    await this.save();
};

// Ensure that account number and card number are unique
bankAccountSchema.index({ accountNumber: 1 }, { unique: true });
bankAccountSchema.index({ 'debitCard.number': 1 }, { unique: true });
bankAccountSchema.index({ 'creditCard.number': 1 }, { unique: true });

const BankAccount = mongoose.model('BankAccount', bankAccountSchema);

module.exports = BankAccount;
