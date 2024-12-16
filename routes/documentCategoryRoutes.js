const express = require('express');
const router = express.Router();
const documentCategoryController = require('../controllers/documentCategoryController');
const processFormDataToJson = require('../middleware/processformdata_to_json');
const authenticateToken = require('../middleware/authenticateToken');

router.post('/add', authenticateToken, processFormDataToJson, documentCategoryController.createDocumentCategory); // Create new category
router.get('/', documentCategoryController.getAllCategories); // Get all categories
router.get('/get', documentCategoryController.getCategoryById); // Get category by ID (ID in req.body)
router.put('/edit', authenticateToken, processFormDataToJson, documentCategoryController.updateDocumentCategory); // Update category (ID in req.body)
router.delete('/delete', authenticateToken, documentCategoryController.deleteDocumentCategory); // Delete category (ID in req.body)

module.exports = router;
