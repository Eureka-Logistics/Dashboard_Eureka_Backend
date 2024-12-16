const express = require('express');
const router = express.Router();
const jobLevelDescriptionController = require('../controllers/jobLevelDescriptionController');
const processFormDataToJson = require('../middleware/processformdata_to_json');
const authenticateToken = require('../middleware/authenticateToken');

// Routes
router.post('/add', authenticateToken, processFormDataToJson, jobLevelDescriptionController.createJobLevelDescription); // Create Job Level Description
router.get('/', jobLevelDescriptionController.getAllJobLevelDescriptions); // Get All Job Level Descriptions
router.get('/get/:id', jobLevelDescriptionController.getJobLevelDescriptionById); // Get Job Level Description by ID
router.put('/edit', authenticateToken, processFormDataToJson, jobLevelDescriptionController.updateJobLevelDescription); // Update Job Level Description
router.delete('/delete/:id', authenticateToken, jobLevelDescriptionController.deleteJobLevelDescription); // Delete Job Level Description

module.exports = router;
