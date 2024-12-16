const Document = require('../models/Document');
const Comment = require('../models/Comment');
const DocumentHistory = require('../models/DocumentHistory');

// CREATE Document
exports.createDocument = async (req, res) => {
  try {
    if (!req.body.document_name || !req.body.document_code || !req.body.id_document_category || !req.body.id_contact || !req.body.modelType) {
      return res.status(400).json({ error: 'document_name, document_code, id_document_category, id_contact, and modelType are required.' });
    }

    // Jika tidak ada end_date yang diberikan, set ke null atau Infinity
    const newDocument = new Document({
      ...req.body,
      file_name: req.file ? req.file.filename : null, // Ambil nama file jika ada
      end_date: req.body.end_date || null, // Jika end_date tidak ada, set ke null
    });

    const savedDocument = await newDocument.save();
    res.status(201).json(savedDocument);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Gagal memproses form-data.' });
  }
}

// READ All Documents
exports.getAllDocuments = async (req, res) => {
  try {
    const documents = await Document.find()
      .populate('id_document_category', 'name')
      .populate('id_office', 'office_name')
      .populate('id_cabinet', 'cabinet_name')
      .populate('id_user', 'full_name')
      .populate('approved_by', 'full_name');

    // Populate id_contact sesuai dengan modelType
    await Promise.all(documents.map(doc => doc.populateContact()));

    res.status(200).json(documents);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// READ Document by ID
exports.getDocumentById = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id)
      .populate('id_document_category', 'name')
      .populate('id_office', 'office_name')
      .populate('id_cabinet', 'cabinet_name')
      .populate('id_user', 'full_name')
      .populate('approved_by', 'full_name');

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Populate id_contact sesuai dengan modelType
    await document.populateContact();

    res.status(200).json(document);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// UPDATE Document
// UPDATE Document
exports.updateDocument = async (req, res) => {
  try {
    const id = req.body.id;

    const updateData = {
      ...req.body,
      date_modified: new Date().toISOString().split('T')[0], // Format tanggal saat ini
    };

    // Jika end_date tidak diberikan, set ke null
    if (!req.body.end_date) {
      updateData.end_date = null;
    }

    if (req.file) updateData.file_name = req.file.filename; // Update `file_name` jika file baru diunggah

    // Cari dokumen yang ada sebelum diupdate
    const existingDocument = await Document.findById(id);
    if (!existingDocument) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Perbarui dokumen
    const updatedDocument = await Document.findByIdAndUpdate(id, updateData, { new: true });

    // Tambahkan riwayat dokumen
    const historyData = {
      document_id: id,
      id_employee: existingDocument.id_user, // ID pengguna yang mengupdate
      previous_file_name: existingDocument.file_name, // Nama file sebelumnya
      date_uploaded: existingDocument.date_modified, // Gunakan date_modified sebelumnya
    };

    await DocumentHistory.create(historyData); // Simpan riwayat dokumen ke database

    // Tambahkan komentar otomatis
    const commentData = {
      document_id: id,
      id_employee: req.body.id_user, // ID pengguna yang mengupdate
      comment: 'File document telah diupdate',
      tanggal_comment: new Date().toLocaleString(), // Tanggal dan waktu saat ini
    };

    await Comment.create(commentData); // Simpan komentar ke database

    // Kembalikan respons berhasil
    res.status(200).json(updatedDocument);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE Document
exports.deleteDocument = async (req, res) => {
  try {
    const deletedDocument = await Document.findByIdAndDelete(req.params.id);
    if (!deletedDocument) {
      return res.status(404).json({ message: 'Document not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// UPDATE Document Status (approve or reject)
exports.updateDocumentStatus = async (req, res) => {
  try {
    const { document_id, status, user_id, comment } = req.body;

    // Validasi input
    if (!document_id || !status || !user_id || !comment) {
      return res.status(400).json({ error: 'Document ID, status, user ID, and comment are required' });
    }

    // Pastikan status yang dikirim adalah salah satu dari 'approved' atau 'rejected'
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status. It should be "approved" or "rejected"' });
    }

    // Temukan dokumen berdasarkan ID
    const document = await Document.findById(document_id);
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Perbarui status dokumen dan catat siapa yang mengubah status
    document.approval_status = status; // Update approval status
    document.approval_date = new Date(); // Set approval date

    if (status === 'approved') {
      document.approved_by = user_id; // Catat siapa yang menyetujui
      document.rejected_by = null; // Hapus rejected_by jika status approved
    } else if (status === 'rejected') {
      document.rejected_by = user_id; // Catat siapa yang menolak
      document.approved_by = null; // Hapus approved_by jika status rejected
    }

    // Simpan komentar ke database
    await Comment.create({
      document_id,
      id_employee: user_id,
      comment
    });

    // Simpan perubahan ke dalam database
    const updatedDocument = await document.save();

    res.status(200).json(updatedDocument); // Kirim respons kembali dengan data yang sudah diperbarui
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
