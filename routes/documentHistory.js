const express = require('express');
const router = express.Router();
const documentHistoryController = require('../controllers/documentHistoryController');

// Endpoint untuk mendapatkan riwayat berdasarkan document_id
router.get('/:document_id', documentHistoryController.getDocumentHistoryByDocumentId);

module.exports = router;
