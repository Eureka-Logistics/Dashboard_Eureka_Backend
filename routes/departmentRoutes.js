const express = require('express');
const router = express.Router();
const departmentController = require('../controllers/departmentController');
const processFormDataToJson = require('../middleware/processformdata_to_json'); // Impor middleware
const authenticateToken = require('../middleware/authenticateToken');

// Routes
router.post('/add', authenticateToken, processFormDataToJson, departmentController.createDepartment); // Create Department
router.get('/', departmentController.getAllDepartments); // Get All Departments
router.get('/get/:id', departmentController.getDepartmentById); // Get Department by ID
router.put('/edit', authenticateToken, processFormDataToJson, departmentController.updateDepartment); // Update Department
router.delete('/delete/:id', authenticateToken, departmentController.deleteDepartment); // Delete Department

module.exports = router;
