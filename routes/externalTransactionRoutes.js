const express = require('express');
const router = express.Router();
const controller = require('../controllers/externalTransactionController');

router.get('/', controller.getAllTransactions);
router.get('/get/:id', controller.getTransactionById); // id refers to id_order

module.exports = router;