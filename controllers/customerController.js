const Customer = require('../models/Customer');
const mongoose = require('mongoose');
const Employee = require('../models/Employee');

// Create Customer
exports.createCustomer = async (req, res) => {
    try {
        const newCustomer = new Customer(req.body);
        await newCustomer.save();
        res.status(201).json({ message: 'Customer created successfully', customer: newCustomer });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create customer.' });
    }
};

// Get All Customers
exports.getCustomers = async (req, res) => {
    try {
        const customers = await Customer.find()
            .populate('id_bu'); // Populate BusinessUnit reference
        res.status(200).json(customers);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve customers.' });
    }
};

// Get Customer by ID
exports.getCustomerById = async (req, res) => {
  try {
    // Step 1: Ambil data customer dan daftar nama dokumen dengan kategori
    const customerWithDocuments = await Customer.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(req.params.id) } // Filter berdasarkan ID customer
      },
      {
        $lookup: {
          from: 'documents', // Nama koleksi dokumen
          localField: '_id', // Field yang digunakan untuk join, id customer
          foreignField: 'id_contact', // Field di tb_document yang mengacu ke id customer
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
          id_bu: { $first: '$id_bu' }, // Misalnya ingin menambahkan data lainnya
        }
      }
    ]);

    // Step 2: Cek apakah customer ditemukan
    if (customerWithDocuments.length === 0) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Ambil data customer dan populate data terkait
    const customer = await Customer.findById(req.params.id)
      .populate('id_bu', 'bu_name') // Populate Business Unit reference
      .lean(); // Gunakan .lean() untuk mendapatkan data biasa, bukan Mongoose document

    // Populate nama lengkap (full_name) pada setiap dokumen
    const populatedDocuments = await Promise.all(customerWithDocuments[0].documents.map(async (doc) => {
      const user = await Employee.findById(doc.id_user).select('full_name'); // Ambil full_name customer
      return {
        ...doc,
        full_name: user ? user.full_name : null // Menambahkan full_name pada setiap dokumen
      };
    }));

    // Menggabungkan hasil populate dengan dokumen
    const result = {
      ...customer,
      document_count: customerWithDocuments[0].document_count,
      documents: populatedDocuments // Menambahkan array dokumen dengan full_name
    };

    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching customer by ID:', error);
    res.status(400).json({ error: error.message });
  }
};

// Update Customer
exports.updateCustomer = async (req, res) => {
    try {
        const { id } = req.body;
        const updatedCustomer = await Customer.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedCustomer) return res.status(404).json({ error: 'Customer not found.' });
        res.status(200).json({ message: 'Customer updated successfully', customer: updatedCustomer });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update customer.' });
    }
};

// Delete Customer
exports.deleteCustomer = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCustomer = await Customer.findByIdAndDelete(id);
        if (!deletedCustomer) return res.status(404).json({ error: 'Customer not found.' });
        res.status(200).json({ message: 'Customer deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete customer.' });
    }
};
