const express = require('express');
const router = express.Router();

const panController = require('../controllers/panController'); 
const apiKeyInUrl = require('../middleware/apiKeyInUrl'); 

router.use(apiKeyInUrl);

router.post('/',panController.createPan);
router.get('/all',panController.getAllPan);
router.get('/:panNumber', panController.getPan);
router.delete('/:panNumber', panController.deletePan);

module.exports = router;