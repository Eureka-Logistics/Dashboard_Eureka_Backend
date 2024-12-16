const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    document_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Document', required: true }, // ID dokumen yang dikomentari
    id_employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true }, // ID employee yang berkomentar
    comment: { type: String, required: true }, // Isi komentar
    tanggal_comment: { type: Date, default: Date.now } // Tanggal komentar ditambahkan
});

module.exports = mongoose.model('Comment', commentSchema);
