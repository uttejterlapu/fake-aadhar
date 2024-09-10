const express = require('express');
const router = express.Router();

const aadhaarController = require('../controllers/aadhaarController'); 
const apiKeyInUrl = require('../middleware/apiKeyInUrl'); 

router.use(apiKeyInUrl);

router.post('/', aadhaarController.createAadhaar);
router.get('/all',aadhaarController.getAllAadhaar);
router.get('/:aadhaarNumber', aadhaarController.getAadhaar);
router.delete('/:aadhaarNumber', aadhaarController.deleteAadhaar);

module.exports = router;
// router.put('/:aadhaarNumber', updateAadhaar);