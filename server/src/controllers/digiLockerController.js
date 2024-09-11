const DigiLocker = require('../models/digiLocker');
const Aadhaar = require('../models/aadhaar');
const { sendEmail } = require('../services/emailService');

// Create DigiLocker
module.exports.createDigiLocker = async (req, res) => {
    try {
        const { aadhaarNumber } = req.body;

        // Check if Aadhaar number exists
        const isAadhaarNumberExists = await Aadhaar.findOne({ aadhaarNumber });
        if (!isAadhaarNumberExists) {
            return res.status(400).send('Invalid Aadhaar Number');
        }

        const { phoneNumber, email } = isAadhaarNumberExists;

        // Create new DigiLocker entry
        const newDigiLocker = new DigiLocker({
            aadhaarNumber,
            phoneNumber,
            email
        });

        const digiLockerDetails = await newDigiLocker.save();

        // Prepare and send email
        const subject = 'Your DigiLocker is Created';
        const text = `Hello ${isAadhaarNumberExists.firstName} ${isAadhaarNumberExists.lastName},\n\n` +
            `Your DigiLocker details have been created successfully!\n\nHere is your information:\n\n` +
            `Aadhaar Number: ${digiLockerDetails.aadhaarNumber}\n` +
            `Digi Locker ID: ${digiLockerDetails.digiLockerID}\n` +
            `Email: ${digiLockerDetails.email}\n\n` +
            `Thank you for registering!\n\nBest regards,\nYour Aadhaar Service`;

        await sendEmail(email, subject, text);

        res.status(201).json({
            digiLockerDetails,
            message: "Check your email for DigiLocker details."
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
