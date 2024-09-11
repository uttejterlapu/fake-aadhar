const Aadhaar = require('../models/aadhaar');
const Pan = require('../models/pan');

const { sendEmail } = require('../services/emailService');

function is18OrOlder(dateOfBirth) {
    const dob = new Date(dateOfBirth);
    const today = new Date();
    const age = today.getFullYear() - dob.getFullYear();
    const monthDifference = today.getMonth() - dob.getMonth();
    const dayDifference = today.getDate() - dob.getDate();

    // Adjust age if the current month/day is before the birth month/day
    if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
        return age - 1 >= 18;
    }

    return age >= 18;
}

module.exports.createPan = async (req, res) => {
    try {
        const { aadhaarNumber } = req.body;

        // Check if Aadhaar number exists
        const isValidAadhaarNumber = await Aadhaar.findOne({ aadhaarNumber: aadhaarNumber });

        if (!isValidAadhaarNumber) {
            return res.status(400).json({ message: "Aadhaar Number Doesn't Exist" });
        }

        if(!is18OrOlder(isValidAadhaarNumber.dateOfBirth))
            return res.status(400).send('Age Less than or equals 18 cannot Create Pan')
        
        const newPanDetails = {
            aadhaarNumber: aadhaarNumber,
            firstName: isValidAadhaarNumber.firstName,
            lastName: isValidAadhaarNumber.lastName,
            middleName: isValidAadhaarNumber.middleName,
            gender: isValidAadhaarNumber.gender,
            dateOfBirth: isValidAadhaarNumber.dateOfBirth,
            address: isValidAadhaarNumber.address,
            fatherName: isValidAadhaarNumber.fatherName,
            motherName: isValidAadhaarNumber.motherName,
            email: isValidAadhaarNumber.email,
            phoneNumber: isValidAadhaarNumber.phoneNumber,
        }

        const panCard = new Pan(newPanDetails)
        const panDetails = await panCard.save();

        const formattedDateOfBirth = new Date(panDetails.dateOfBirth).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        const subject = 'Your Pan Details';
        const text = `Hello ${panDetails.firstName} ${panDetails.lastName},\n\nYour Pan details have been created successfully!\n\nHere is your information:\n\n` +
            `Pan Number: ${panDetails.panNumber}\n` +
            `Aadhaar Number: ${panDetails.aadhaarNumber}\n` +
            `First Name: ${panDetails.firstName}\n` +
            `Last Name: ${panDetails.lastName}\n` +
            `Middle Name: ${panDetails.middleName || 'N/A'}\n` +
            `Gender: ${panDetails.gender}\n` +
            `Date of Birth: ${formattedDateOfBirth}\n` +
            `Father's Name: ${panDetails.fatherName}\n` +
            `Mother's Name: ${panDetails.motherName}\n` +
            `Phone Number: ${panDetails.phoneNumber}\n\n` +
            `Email: ${panDetails.email}\n\n` +
            `Thank you for registering!\n\nBest regards,\nYour Aadhaar Service`;

        await sendEmail(isValidAadhaarNumber.email, subject, text);

        res.status(200).json(panDetails);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

module.exports.getPan = async (req, res) => {
    try {
        const pan = await Pan.findOne({ panNumber: req.params.panNumber });
        if (!pan) return res.status(404).json({ message: 'Pan not found' });
        res.json(pan);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports.deletePan = async (req, res) => {
    try {
        const pan = await Pan.findOneAndDelete({ panNumber: req.params.panNumber });
        if (!pan) return res.status(404).json({ message: 'Pan not found' });
        res.json({ message: 'Pan deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports.getAllPan = async (req, res) => {
    try {
        const panRecords = await Pan.find().select('-_id -__v');

        if (!panRecords.length) {
            return res.status(404).json({ message: 'No Pan records found' });
        }
        // res.status(200).json({ message: 'Fetched successfully', data: panRecords });
        res.status(200).json(panRecords);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
