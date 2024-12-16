const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const processFormDataToJson = require('../middleware/processformdata_to_json');
const { uploadPhoto } = require('../middleware/upload');
const path = require('path');
const authenticateToken = require('../middleware/authenticateToken');

// Routes
router.post('/add', authenticateToken, uploadPhoto.single('photo'), processFormDataToJson, employeeController.createEmployee); // Add new employee
router.get('/', employeeController.getAllEmployees); // Get all employees
router.get('/get/:id', employeeController.getEmployeeById); // Get specific employee by ID
router.put('/edit', authenticateToken, uploadPhoto.single('photo'), processFormDataToJson, employeeController.updateEmployee); // Update employee
router.delete('/delete/:id', authenticateToken, employeeController.deleteEmployee); // Delete employee

module.exports = router;

// View image
router.get('/view/:fileName', (req, res) => {
    const fileName = req.params.fileName;
    const filePath = path.join(__dirname, '../uploads/photos', fileName); // Pastikan path menuju ke folder foto

    // Mengirim file gambar jika ditemukan
    res.sendFile(filePath, (err) => {
      if (err) {
        console.error(err);
        res.status(404).json({ message: 'File not found' });
      } else {
        console.log(`File ${fileName} sent successfully`);
      }
    });
});
