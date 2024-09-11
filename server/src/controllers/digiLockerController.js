const DigiLocker = require('../models/digiLocker');
const Aadhaar = require('../models/aadhaar');
const Pan = require('../models/pan');
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
            `Thank you for registering!\n\nBest regards,\nYour Aadhaar Service\nAwait for your verification!`;

        await sendEmail(email, subject, text);

        res.status(201).json({
            digiLockerDetails,
            message: "Check your email for DigiLocker details."
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

module.exports.getDigiLocker = async (req, res) => {
    try {
        const digiLocker = await DigiLocker.findOne({ digiLockerID: req.params.digiLockerID }).select('-_id -__v');
        if (!digiLocker) return res.status(404).json({ message: 'DigiLocker Account not found' });
        res.json(digiLocker);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports.getAllDigiLocker = async (req, res) => {
    try {
        const digiLockerRecords = await DigiLocker.find().select('-_id -__v');
        if (!digiLockerRecords.length) {
            return res.status(404).json({ message: 'No digiLocker records found' });
        }
        res.status(200).json(digiLockerRecords);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports.verifyDigiLocker = async (req, res) => {
    try {
        // Find the DigiLocker by digiLockerID
        const digiLocker = await DigiLocker.findOne({ digiLockerID: req.params.digiLockerID }).select('-__v');
        
        // If no DigiLocker is found, return a 404 error
        if (!digiLocker) {
            return res.status(404).json({ message: 'DigiLocker not found' });
        }

        // Check if the DigiLocker is already verified
        if (digiLocker.verified) {
            return res.status(200).json({ message: 'DigiLocker is already verified' });
        }

        // Mark the DigiLocker as verified
        digiLocker.verified = true;
        await digiLocker.save();

        // Fetch the user's Aadhaar details (assuming Aadhaar schema exists)
        const { aadhaarNumber, email } = digiLocker;
        const digiLockerName = await Aadhaar.findOne({ aadhaarNumber });

        if (!digiLockerName) {
            return res.status(404).json({ message: 'Aadhaar details not found' });
        }

        // Email subject and body
        const subject = 'Your DigiLocker has been successfully verified';
        const text = `Hello ${digiLockerName.firstName} ${digiLockerName.lastName},\n\n` +
            `Your DigiLocker has been verified successfully!\n\nHere are your details:\n` +
            `Aadhaar Number: ${aadhaarNumber}\n` +
            `DigiLocker ID: ${digiLocker.digiLockerID}\n` +
            `Email: ${email}\n\n` +
            `Thank you for using DigiLocker!\n\nBest regards,\nYour DigiLocker Service Team`;

        // Send the email using nodemailer
        await sendEmail(email, subject, text);

        // Respond with success
        res.status(200).json({ message: 'DigiLocker verified and email sent successfully', digiLocker });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


module.exports.addDocument = async (req, res) => {
    try {
        // Find the DigiLocker by digiLockerID
        const digiLocker = await DigiLocker.findOne({ digiLockerID: req.params.digiLockerID }).select('-__v');
        
        // If no DigiLocker is found, return a 404 error
        if (!digiLocker) {
            return res.status(404).json({ message: 'DigiLocker not found' });
        }
        // console.log(digiLocker);
        
        if(!digiLocker.verified){
            return res.status(404).json({ message: 'DigiLocker verifycation Pending.' });
        }

        // Add the new document to the documents map
        // Assuming the request body contains a key-value pair like { "documentType": "documentValue" }
        const { documentType, documentValue } = req.body;
        
        if (!documentType || !documentValue) {
            return res.status(400).json({ message: 'Invalid document data provided' });
        }

        // Allow only panNumber to be added
        if (documentType !== 'panNumber') {
            return res.status(400).json({ message: 'Only PAN Number addition is allowed.' });
        }

        // Check if the provided PAN exists
        const panVerify = await Pan.findOne({ panNumber: documentValue });

        if (!panVerify) {
            return res.status(400).json({ message: 'PAN Number does not exist.' });
        }

        // Ensure the PAN number belongs to the same Aadhaar number
        if (panVerify.aadhaarNumber !== digiLocker.aadhaarNumber) {
            return res.status(400).json({ message: 'Provided PAN Number does not match the Aadhaar number linked to this DigiLocker.' });
        }

        // Add or update the PAN number in the documents map
        digiLocker.documents.set(documentType, documentValue);

        // Save the updated DigiLocker
        await digiLocker.save();

        res.status(200).json({ message: 'PAN Number added successfully', digiLocker });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


// async function test(){
//     try {
//         const digi = await DigiLocker.find().select('-_id -__v');
        
//         if (digi.length > 0) {
//             const documents = digi[0].documents;
//             console.log("Documents:", documents);
//             console.log("Number of documents:", documents.size); // Use size to get the number of key-value pairs
//         } else {
//             console.log("No DigiLocker records found.");
//         }
//     } catch (err) {
//         console.error("Error: ", err.message);
//     }
// }
// test();
 