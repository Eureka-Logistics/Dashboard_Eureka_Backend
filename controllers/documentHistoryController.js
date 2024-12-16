const DocumentHistory = require('../models/DocumentHistory');

exports.getDocumentHistoryByDocumentId = async (req, res) => {
  try {
    const { document_id } = req.params;

    // Validasi apakah ID dokumen diberikan
    if (!document_id) {
      return res.status(400).json({ error: 'Document ID is required.' });
    }

    // Ambil riwayat berdasarkan document_id
    const documentHistory = await DocumentHistory.find({ document_id })
      .populate('id_employee', 'full_name') // Jika perlu, ambil nama user dari referensi
      .sort({ date_uploaded: -1 }); // Urutkan dari yang terbaru ke yang lama

    // Jika tidak ditemukan riwayat
    if (documentHistory.length === 0) {
      return res.status(404).json({ message: 'No history found for the given document ID.' });
    }

    res.status(200).json(documentHistory);
  } catch (error) {
    console.error('Error fetching document history:', error);
    res.status(500).json({ error: 'Failed to fetch document history.' });
  }
};
