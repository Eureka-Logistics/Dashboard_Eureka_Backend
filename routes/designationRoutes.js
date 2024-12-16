const express = require('express');
const router = express.Router();
const designationController = require('../controllers/designationController');
const processFormDataToJson = require('../middleware/processformdata_to_json');
const authenticateToken = require('../middleware/authenticateToken');

// Routes
router.post('/add', authenticateToken, processFormDataToJson, designationController.createDesignation); // Create Designation
router.get('/', designationController.getAllDesignations); // Get All Designations
router.get('/get/:id', designationController.getDesignationById); // Get Designation by ID
router.put('/edit', authenticateToken, processFormDataToJson, designationController.updateDesignation); // Update Designation
router.delete('/delete/:id', authenticateToken, designationController.deleteDesignation); // Delete Designation

module.exports = router;
