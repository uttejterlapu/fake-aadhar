const mongoose = require('mongoose');

// Helper function to generate a 16-digit Aadhaar number
const generateAadhaarNumber = async () => {
  let aadhaarNumber;
  let exists = true;

  while (exists) {
    aadhaarNumber = Math.floor(1000000000000000 + Math.random() * 9000000000000000).toString();
    const existingAadhaar = await Aadhaar.findOne({ aadhaarNumber });
    if (!existingAadhaar) {
      exists = false;
    }
  }
  return aadhaarNumber;
};

const aadhaarSchema = new mongoose.Schema({
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
  phoneNumber:{
    type: String,
    required: true,
  }
});

// Pre-save hook to generate Aadhaar number
aadhaarSchema.pre('save', async function (next) {
  if (!this.aadhaarNumber) {
    this.aadhaarNumber = await generateAadhaarNumber();
  }
  next();
});

const Aadhaar = mongoose.model('Aadhaar', aadhaarSchema);

module.exports = Aadhaar;
