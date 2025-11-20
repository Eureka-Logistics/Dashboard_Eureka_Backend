const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Konfigurasi penyimpanan untuk foto (Employee)
const photoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/photos/';
    try {
      fs.mkdirSync(dir, { recursive: true });
    } catch (e) {}
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Menambahkan timestamp untuk menghindari nama file yang sama
  }
});
const uploadPhoto = multer({ storage: photoStorage });

// Konfigurasi penyimpanan untuk dokumen (Document)
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/documents/';
    try {
      fs.mkdirSync(dir, { recursive: true });
    } catch (e) {}
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Menambahkan timestamp untuk menghindari nama file yang sama
  }
});
const uploadFile = multer({ storage: fileStorage });

module.exports = { uploadPhoto, uploadFile };
