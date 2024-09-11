const Aadhaar = require('../models/aadhaar');
const { sendEmail } = require('../services/emailService');
// Create Aadhaar
module.exports.createAadhaar = async (req, res) => {
    try {
        const { firstName, lastName, middleName, gender, fatherName, motherName, email, phoneNumber } = req.body;

        const convertToUpperCase = (field) => field && field.toUpperCase();
        req.body.gender = convertToUpperCase(gender)
        req.body.firstName = convertToUpperCase(firstName);
        req.body.lastName = convertToUpperCase(lastName);
        req.body.middleName = convertToUpperCase(middleName);
        req.body.fatherName = convertToUpperCase(fatherName);
        req.body.motherName = convertToUpperCase(motherName);

        if (!phoneNumber || !/^\d{10}$/.test(phoneNumber)) {
            return res.status(400).json({ message: "Phone number must contain only numbers and be 10 digits long." });
        }

        const newAadhaar = new Aadhaar(req.body);
        const aadhaarDetails = await newAadhaar.save();

        const formattedDateOfBirth = new Date(aadhaarDetails.dateOfBirth).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        const subject = 'Your Aadhaar Details';
        const text = `Hello ${aadhaarDetails.firstName} ${aadhaarDetails.lastName},\n\nYour Aadhaar details have been created successfully!\n\nHere is your information:\n\n` +
            `Aadhaar Number: ${aadhaarDetails.aadhaarNumber}\n` +
            `First Name: ${aadhaarDetails.firstName}\n` +
            `Last Name: ${aadhaarDetails.lastName}\n` +
            `Middle Name: ${aadhaarDetails.middleName || 'N/A'}\n` +
            `Gender: ${aadhaarDetails.gender}\n` +
            `Date of Birth: ${formattedDateOfBirth}\n` +
            `Father's Name: ${aadhaarDetails.fatherName}\n` +
            `Mother's Name: ${aadhaarDetails.motherName}\n` +
            `Phone Number: ${aadhaarDetails.phoneNumber}\n\n` +
            `Email: ${aadhaarDetails.email}\n\n` +
            `Thank you for registering!\n\nBest regards,\nYour Aadhaar Service`;

        await sendEmail(email, subject, text);
        res.status(201).json(newAadhaar);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Get Aadhaar by number
module.exports.getAadhaar = async (req, res) => {
    try {
        const aadhaar = await Aadhaar.findOne({ aadhaarNumber: req.params.aadhaarNumber });
        if (!aadhaar) return res.status(404).json({ message: 'Aadhaar not found' });
        res.json(aadhaar);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// // Update Aadhaar
// module.exports.updateAadhaar = async (req, res) => {
//   try {
//     const aadhaar = await Aadhaar.findOneAndUpdate(
//       { aadhaarNumber: req.params.aadhaarNumber },
//       req.body,
//       { new: true }
//     );
//     if (!aadhaar) return res.status(404).json({ message: 'Aadhaar not found' });
//     res.json(aadhaar);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// Delete Aadhaar
module.exports.deleteAadhaar = async (req, res) => {
    try {
        const aadhaar = await Aadhaar.findOneAndDelete({ aadhaarNumber: req.params.aadhaarNumber });
        if (!aadhaar) return res.status(404).json({ message: 'Aadhaar not found' });
        res.json({ message: 'Aadhaar deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports.getAllAadhaar = async (req, res) => {
    try {
        const aadhaarRecords = await Aadhaar.find();

        if (!aadhaarRecords.length) {
            return res.status(404).json({ message: 'No Aadhaar records found' });
        }
        res.status(200).json(aadhaarRecords);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
