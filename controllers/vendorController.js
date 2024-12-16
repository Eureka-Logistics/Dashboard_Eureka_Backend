const Vendor = require('../models/Vendor');
const Employee = require('../models/Employee');
const mongoose = require('mongoose');

// Create Vendor
exports.createVendor = async (req, res) => {
    try {
        const newVendor = new Vendor(req.body);
        await newVendor.save();
        res.status(201).json({ message: 'Vendor created successfully', vendor: newVendor });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create vendor.' });
    }
};

// Get All Vendors
exports.getVendors = async (req, res) => {
    try {
        const vendors = await Vendor.find()
            .populate('id_bu'); // Populate BusinessUnit reference
        res.status(200).json(vendors);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve vendors.' });
    }
};

// Get Vendor by ID
exports.getVendorById = async (req, res) => {
  try {
    // Step 1: Ambil data vendor dan daftar nama dokumen dengan kategori
    const vendorWithDocuments = await Vendor.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(req.params.id) } // Filter berdasarkan ID vendor
      },
      {
        $lookup: {
          from: 'documents', // Nama koleksi dokumen
          localField: '_id', // Field yang digunakan untuk join, id vendor
          foreignField: 'id_contact', // Field di tb_document yang mengacu ke id vendor
          as: 'documents' // Hasil join akan dimasukkan dalam array 'documents'
        }
      },
      {
        $unwind: {
          path: '$documents',
          preserveNullAndEmptyArrays: true // Biarkan dokumen tetap ada meski tidak ada dokumen
        }
      },
      {
        $lookup: {
          from: 'documentcategories', // Nama koleksi kategori dokumen
          localField: 'documents.id_document_category', // Field kategori dokumen
          foreignField: '_id', // Field ID kategori dokumen
          as: 'documents.category' // Tambahkan data kategori ke dokumen
        }
      },
      {
        $unwind: {
          path: '$documents.category',
          preserveNullAndEmptyArrays: true // Biarkan tetap null jika kategori tidak ditemukan
        }
      },
      {
        $group: {
          _id: '$_id',
          documents: {
            $push: {
              document_name: '$documents.document_name',
              document_code: '$documents.document_code',
              id_document_category: '$documents.id_document_category',
              category_name: '$documents.category.name', // Nama kategori
              date_added: '$documents.date_added',
              id_user: '$documents.id_user'
            }
          },
          document_count: { $sum: { $cond: [{ $ifNull: ['$documents', false] }, 1, 0] } },
          id_bu: { $first: '$id_bu' }, // Menambahkan data id_bu
        }
      }
    ]);

    // Step 2: Cek apakah vendor ditemukan
    if (vendorWithDocuments.length === 0) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    // Ambil data vendor dan populate data terkait
    const vendor = await Vendor.findById(req.params.id)
      .populate('id_bu', 'bu_name') // Populate Business Unit reference
      .lean(); // Gunakan .lean() untuk mendapatkan data biasa, bukan Mongoose document

    // Populate nama lengkap (full_name) pada setiap dokumen
    const populatedDocuments = await Promise.all(vendorWithDocuments[0].documents.map(async (doc) => {
      const user = await Employee.findById(doc.id_user).select('full_name'); // Ambil full_name dari Employee
      return {
        ...doc,
        full_name: user ? user.full_name : null // Menambahkan full_name pada setiap dokumen
      };
    }));

    // Menggabungkan hasil populate dengan dokumen
    const result = {
      ...vendor,
      document_count: vendorWithDocuments[0].document_count,
      documents: populatedDocuments // Menambahkan array dokumen dengan full_name
    };

    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching vendor by ID:', error);
    res.status(400).json({ error: error.message });
  }
};

// Update Vendor
exports.updateVendor = async (req, res) => {
    try {
      // Update data vendor berdasarkan id yang diterima dari body request
      const updatedVendor = await Vendor.findByIdAndUpdate(req.body.id, req.body, { new: true });
  
      // Jika vendor tidak ditemukan
      if (!updatedVendor) {
        return res.status(404).json({ message: 'Vendor tidak ditemukan' });
      }
  
      // Response berhasil dengan data vendor yang telah diperbarui
      res.status(200).json(updatedVendor);
    } catch (error) {
      // Tangani error jika ada
      res.status(400).json({ error: error.message });
    }
  };  

// Delete Vendor
exports.deleteVendor = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedVendor = await Vendor.findByIdAndDelete(id);
        if (!deletedVendor) return res.status(404).json({ error: 'Vendor not found.' });
        res.status(200).json({ message: 'Vendor deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete vendor.' });
    }
};
