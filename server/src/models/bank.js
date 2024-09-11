const mongoose = require('mongoose');

const bankSchema = new mongoose.Schema({
    bankAccountNumber:{
        type: String,
        unique: true,
    },
    IFSRCNumber:{
        type: String,
    },
    bankName:{
        type: String,
        required: true,
    },
    aadhaarNumber: {
        type: String,
        unique: true,
    },
    panNumber:{
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
    },

});

const Bank = mongoose.model('Bank', bankSchema);