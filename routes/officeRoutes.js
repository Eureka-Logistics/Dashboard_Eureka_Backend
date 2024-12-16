const express = require('express');
const router = express.Router();
const officeController = require('../controllers/officeController');
const processFormDataToJson = require('../middleware/processformdata_to_json');
const authenticateToken = require('../middleware/authenticateToken');

// Routes
router.post('/add', authenticateToken, processFormDataToJson, officeController.createOffice); // Create Office
router.get('/', officeController.getAllOffices); // Get All Offices
router.get('/get/:id', officeController.getOfficeById); // Get Office by ID
router.put('/edit', authenticateToken, processFormDataToJson, officeController.updateOffice); // Update Office
router.delete('/delete/:id', authenticateToken, officeController.deleteOffice); // Delete Office

module.exports = router;
