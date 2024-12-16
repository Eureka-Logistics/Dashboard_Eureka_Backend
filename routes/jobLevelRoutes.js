const express = require('express');
const router = express.Router();
const jobLevelController = require('../controllers/jobLevelController');
const processFormDataToJson = require('../middleware/processformdata_to_json');
const authenticateToken = require('../middleware/authenticateToken');

// Routes
router.post('/add', authenticateToken, processFormDataToJson, jobLevelController.createJobLevel); // Create JobLevel
router.get('/', jobLevelController.getAllJobLevels); // Get All JobLevels
router.get('/get/:id', jobLevelController.getJobLevelById); // Get JobLevel by ID
router.put('/edit', authenticateToken, processFormDataToJson, jobLevelController.updateJobLevel); // Update JobLevel
router.delete('/delete/:id', authenticateToken, jobLevelController.deleteJobLevel); // Delete JobLevel

module.exports = router;
