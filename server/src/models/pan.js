const mongoose = require('mongoose');// Ensure the path is correct

// Helper function to generate a 10-digit PAN number
const generatePanNumber = async () => {
    let panNumber;
    let exists = true;
    while (exists) {
        panNumber = Math.floor(1000000000 + Math.random() * 9000000000).toString();
        const existingPan = await Pan.findOne({ panNumber });
        if (!existingPan) {
            exists = false;
        }
    }
    return panNumber; // Return the generated panNumber
};

const panSchema = new mongoose.Schema({
    panNumber: {
        type: String,
        unique: true,
    },
    aadhaarNumber: {
        type: String,
        unique: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    middleName: {
        type: String,
    },
    gender: {
        type: String,
        required: true,
        enum: ['MALE', 'FEMALE'],
    },
    dateOfBirth: {
        type: Date,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    fatherName: {
        type: String,
        required: true,
    },
    motherName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    }
});

// Pre-save hook to generate PAN number
panSchema.pre('save', async function (next) {
    if (!this.panNumber) {
        this.panNumber = await generatePanNumber();
    }
    next();
});

const Pan = mongoose.model('Pan', panSchema);

module.exports = Pan;
