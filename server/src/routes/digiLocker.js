const express = require('express');
const router = express.Router();

const digiLockerController = require('../controllers/digiLockerController'); 
const apiKeyInUrl = require('../middleware/apiKeyInUrl'); 

router.use(apiKeyInUrl);

router.post('/', digiLockerController.createDigiLocker);

module.exports = router;
// router.put('/:aadhaarNumber', updateAadhaar);