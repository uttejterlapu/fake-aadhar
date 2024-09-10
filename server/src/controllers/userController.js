const User = require('../models/user');
const crypto = require('crypto');
const { sendEmail } = require('../services/emailService');



module.exports.registerUser = async (req, res) => {
    try {
        const { name, email } = req.body;
        
        const emailExist = User.findOne({ email });
        if (!emailExist)
            return res.status(400).json({ message: 'Email already exists' });
        else {
            // Generate a unique API key
            const apiKey = crypto.randomBytes(20).toString('hex');

            // Create a new user with the unique API key
            const newUser = new User({ name, email, apiKey });
            await newUser.save();

            // Prepare email content
            const subject = 'Your API Key';
            const text = `Hello ${name},\n\nYour API key is: ${apiKey}\n\nThank you!`;

            // Send API key via email using the email service
            await sendEmail(email, subject, text);

            res.status(201).json({ message: 'User registered and API key sent to email' });
        }
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
