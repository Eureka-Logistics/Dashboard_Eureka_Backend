// middlewares/processformdata_to_json.js

// Middleware untuk memproses form-data ke JSON
const processFormDataToJson = (req, res, next) => {
    try {
        // Tetapkan nilai default untuk date_added dan date_modified
        if (!req.body.date_added) {
            req.body.date_added = new Date().toISOString().split('T')[0];
        }
        req.body.date_modified = new Date().toISOString().split('T')[0];

        // Menambahkan nama file yang diunggah dari `upload.single`
        if (req.file) {
            req.body.file_name = req.file.filename; // Nama file yang disimpan
        }

        next();
    } catch (error) {
        console.error('Error processing form-data:', error); // Log kesalahan
        return res.status(400).json({ error: 'Gagal memproses form-data.', details: error.message });
    }
};

module.exports = processFormDataToJson;
