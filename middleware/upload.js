const multer = require('multer');
const path = require('path');

// Konfigurasi penyimpanan untuk foto (Employee)
const photoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/photos/'); // Folder penyimpanan foto
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Menambahkan timestamp untuk menghindari nama file yang sama
  }
});
const uploadPhoto = multer({ storage: photoStorage });

// Konfigurasi penyimpanan untuk dokumen (Document)
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/documents/'); // Folder penyimpanan dokumen
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Menambahkan timestamp untuk menghindari nama file yang sama
  }
});
const uploadFile = multer({ storage: fileStorage });

module.exports = { uploadPhoto, uploadFile };
