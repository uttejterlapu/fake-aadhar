const express = require('express');
const router = express.Router();

const digiLockerController = require('../controllers/digiLockerController'); 
const apiKeyInUrl = require('../middleware/apiKeyInUrl'); 

router.use(apiKeyInUrl);

router.post('/', digiLockerController.createDigiLocker);
router.get('/:digiLockerID', digiLockerController.getDigiLocker);
router.get('/all', digiLockerController.getAllDigiLocker);
router.put('/verify/:digiLockerID', digiLockerController.verifyDigiLocker);
router.put('/add/:digiLockerID', digiLockerController.addDocument);

module.exports = router;
// router.put('/:aadhaarNumber', updateAadhaar);