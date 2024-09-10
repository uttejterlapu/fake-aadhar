const Aadhaar = require('../models/aadhaar');

// Create Aadhaar
module.exports.createAadhaar = async (req, res) => {
    try {
        const newAadhaar = new Aadhaar(req.body);
        await newAadhaar.save();
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

module.exports.getAll = async (req, res) => {
    try {
        const aadhaarRecords = await Aadhaar.find();

        if (!aadhaarRecords.length) {
            return res.status(404).json({ message: 'No Aadhaar records found' });
        }
        res.status(200).json({ message: 'Fetched successfully', data: aadhaarRecords });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
