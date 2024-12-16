const Comment = require('../models/Comment');
const Employee = require('../models/Employee');

// Tambahkan komentar baru
exports.addComment = async (req, res) => {
    try {
        const { document_id, comment, id_employee } = req.body;

        // Log data yang diterima dari body
        console.log("Received data:", req.body);

        // Validasi input
        if (!document_id || !comment || !id_employee) {
            return res.status(400).json({ error: 'Document ID, comment, and employee ID are required' });
        }

        // Simpan komentar ke database
        const newComment = await Comment.create({
            document_id,
            id_employee,
            comment
        });

        res.status(201).json(newComment);
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ error: error.message });
    }
};

// Ambil semua komentar untuk dokumen tertentu
exports.getCommentsByDocument = async (req, res) => {
    try {
        const { documentId } = req.params;

        const comments = await Comment.find({ document_id: documentId })
            .populate('id_employee', 'full_name') // Populate nama employee
            .sort({ tanggal_comment: -1 }); // Urutkan dari komentar terbaru

        res.status(200).json(comments);
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(400).json({ error: error.message });
    }
};