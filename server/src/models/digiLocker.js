const mongoose = require('mongoose');

// Helper function to generate a unique DigiLocker ID
const generateDigiLockerID = async () => {
    let digiLockerID;
    let exists = true;

    while (exists) {
        digiLockerID = Math.floor(10000000 + Math.random() * 90000000).toString();
        const existingID = await DigiLocker.findOne({ digiLockerID });
        if (!existingID) {
            exists = false;
        }
    }
    return digiLockerID; // Return the generated DigiLocker ID
};

const digiLockerSchema = new mongoose.Schema({
    digiLockerID: {
        type: String,
        unique: true
    },
    aadhaarNumber: {
        type: String,
        unique: true,
    },
    email: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    verified: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    documents: {
        type: Map,
        of: String,
        default: {}, // This will store key-value pairs of document types and their values (like panNumber, etc.)
    },
});

// Pre-save hook to generate DigiLocker ID
digiLockerSchema.pre('save', async function (next) {
    if (!this.digiLockerID) {
        this.digiLockerID = await generateDigiLockerID();
    }
    next();
});

const DigiLocker = mongoose.model('DigiLocker', digiLockerSchema);

module.exports = DigiLocker;
