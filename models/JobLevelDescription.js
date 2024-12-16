const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const jobLevelDescriptionSchema = new mongoose.Schema({
    id_joblevel: { type: Schema.Types.ObjectId, ref: 'JobLevel' },
    atasan: { type: String, required: true },
    bawahan: { type: String, required: true },
    tujuan: { type: String, required: true },
    jobdesc: { type: String, required: true },
    wewenang: { type: String, required: true },
    ukuran: { type: String, required: true },
    persyaratan: { type: String, required: true },
    spesifikasi: { type: String, required: true },
}, {
    timestamps: true // Menyimpan tanggal pembuatan dan modifikasi
});

module.exports = mongoose.model('JobLevelDescription', jobLevelDescriptionSchema);
