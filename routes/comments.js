const express = require('express');
const router = express.Router();
const { addComment, getCommentsByDocument } = require('../controllers/commentController');
const authenticateToken = require('../middleware/authenticateToken');

// Route untuk menambahkan komentar
router.post('/add', authenticateToken, addComment);

// Route untuk mendapatkan semua komentar berdasarkan dokumen
router.get('/:documentId', getCommentsByDocument);

module.exports = router;
