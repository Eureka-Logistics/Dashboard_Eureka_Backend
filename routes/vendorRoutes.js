const express = require('express');
const router = express.Router();
const vendorController = require('../controllers/vendorController');
const processFormDataToJson = require('../middleware/processformdata_to_json');
const authenticateToken = require('../middleware/authenticateToken');

router.post('/add', authenticateToken, processFormDataToJson, vendorController.createVendor);
router.get('/', vendorController.getVendors);
router.get('/get/:id', vendorController.getVendorById);
router.put('/edit', authenticateToken, processFormDataToJson, vendorController.updateVendor);
router.delete('/delete/:id', authenticateToken, vendorController.deleteVendor);

module.exports = router;
