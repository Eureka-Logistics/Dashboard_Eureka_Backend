const express = require('express');
const router = express.Router();
const cabinetController = require('../controllers/cabinetController'); // Impor controller
const processFormDataToJson = require('../middleware/processformdata_to_json');
const authenticateToken = require('../middleware/authenticateToken');

// Routes
router.post('/add', authenticateToken, processFormDataToJson, cabinetController.createCabinet); // Create Cabinet
router.get('/', cabinetController.getAllCabinets); // Get All Cabinets
router.get('/get', cabinetController.getCabinetById); // Get Cabinet by ID
router.put('/edit', authenticateToken, processFormDataToJson, cabinetController.updateCabinet); // Update Cabinet
router.delete('/delete/:id', authenticateToken, cabinetController.deleteCabinet); // Delete Cabinet

module.exports = router;
