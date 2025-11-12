const express = require('express');
const router = express.Router();
const controller = require('../controllers/externalCustomerController');

router.get('/', controller.getAllCustomers);
router.get('/get/:id', controller.getCustomerById); // id refers to id_user

module.exports = router;