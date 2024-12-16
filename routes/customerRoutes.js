const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const processFormDataToJson = require('../middleware/processformdata_to_json');
const authenticateToken = require('../middleware/authenticateToken');

router.post('/add', authenticateToken, processFormDataToJson, customerController.createCustomer);
router.get('/', customerController.getCustomers);
router.get('/get/:id', customerController.getCustomerById);
router.put('/edit', authenticateToken, processFormDataToJson, customerController.updateCustomer);
router.delete('/delete/:id', authenticateToken, customerController.deleteCustomer);

module.exports = router;
