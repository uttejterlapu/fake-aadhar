const express = require('express');
const router = express.Router();

const aadhaarController = require('../controllers/aadhaarController'); 
const apiKeyInUrl = require('../middleware/apiKeyInUrl'); 

router.use(apiKeyInUrl);

router.get('/all',aadhaarController.getAll);
router.post('/', aadhaarController.createAadhaar);
router.get('/:aadhaarNumber', aadhaarController.getAadhaar);
// router.put('/:aadhaarNumber', updateAadhaar);
router.delete('/:aadhaarNumber', aadhaarController.deleteAadhaar);

module.exports = router;