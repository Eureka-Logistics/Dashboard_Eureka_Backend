const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');
const processFormDataToJson = require('../middleware/processformdata_to_json');
const { uploadFile } = require('../middleware/upload'); // Import uploadFile
const path = require('path');
const authenticateToken = require('../middleware/authenticateToken');

// Routes untuk Document
router.post('/add', authenticateToken, uploadFile.single('file_name'), processFormDataToJson, documentController.createDocument);
router.put('/edit', authenticateToken, uploadFile.single('file_name'), processFormDataToJson, documentController.updateDocument);
router.get('/', documentController.getAllDocuments);
router.get('/get/:id', documentController.getDocumentById);
router.delete('/delete/:id', authenticateToken, documentController.deleteDocument);

// Route untuk Approve Document (Menambahkan route baru)
router.put('/update-status', documentController.updateDocumentStatus); // Menambahkan route approve document

// Routes untuk menampilkan dan mengunduh dokumen
router.get('/view/:fileName', (req, res) => {
  const fileName = req.params.fileName;
  const filePath = path.join(__dirname, '../uploads/documents', fileName);
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error(err);
      res.status(404).json({ message: 'File not found' });
    }
  });
});

router.get('/download/:fileName', (req, res) => {
  const fileName = req.params.fileName;
  const filePath = path.join(__dirname, '../uploads/documents', fileName);
  res.download(filePath, fileName, (err) => {
    if (err) {
      console.error('Error downloading file:', err);
      res.status(404).json({ message: 'File not found' });
    }
  });
});

module.exports = router;
