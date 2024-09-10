const User = require('../models/user'); // Import the User model

module.exports = async (req, res, next) => {
  const apiKey = req.query.api_key; // API key is expected in the URL query parameters

  if (!apiKey) {
    return res.status(401).json({ message: 'Unauthorized: API key is missing' });
  }

  try {
    // Check if the API key exists in the database
    const user = await User.findOne({ apiKey });

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized: Invalid API Key' });
    }

    // Attach user info to request if needed
    req.user = user;
    
    next();
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
