const express = require('express');
const router = express.Router();
const buController = require('../controllers/buController');
const processFormDataToJson = require('../middleware/processformdata_to_json');
const authenticateToken = require('../middleware/authenticateToken');

// Routes
router.post('/add', authenticateToken, processFormDataToJson, buController.createBU); // Create BU
router.get('/', buController.getAllBUs); // Get All BUs
router.get('/get/:id', buController.getBUById); // Get BU by ID
router.put('/edit', processFormDataToJson, authenticateToken, buController.updateBU); // Update BU
router.delete('/delete/:id', authenticateToken, buController.deleteBU); // Delete BU

module.exports = router;
