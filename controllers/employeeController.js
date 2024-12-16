const Employee = require('../models/Employee'); // Import schema model
const mongoose = require('mongoose');

// CREATE Employee
exports.createEmployee = async (req, res) => {
  try {
    const employeeData = {
      ...req.body,
      date_modified: new Date(),
      photo: req.file ? req.file.filename : null, // Simpan nama file foto
    };

    const newEmployee = new Employee(employeeData);
    const savedEmployee = await newEmployee.save();
    
    res.status(201).json({
      status: 'success',
      data: savedEmployee,
    });
  } catch (error) {
    console.error('Error while creating employee:', error);

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        status: 'error',
        message: 'Gagal menambah data karyawan. Pastikan semua field yang diperlukan sudah terisi dengan benar.',
        details: error.message,
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        status: 'error',
        message: 'Gagal menambah data karyawan. Email sudah terdaftar.',
      });
    }

    res.status(500).json({
      status: 'error',
      message: 'Terjadi kesalahan saat menambah data karyawan.',
    });
  }
};

// READ All Employees with Joins
exports.getAllEmployees = async (req, res) => {
  try {
    // Step 1: Ambil data karyawan dan jumlah dokumen menggunakan aggregate
    const employeesWithDocCount = await Employee.aggregate([
      {
        $lookup: {
          from: 'documents', // Nama koleksi dokumen, pastikan nama sesuai
          localField: '_id', // Field yang digunakan untuk join, id karyawan
          foreignField: 'id_contact', // Field di tb_document yang mengacu ke id karyawan
          as: 'documents'
        }
      },
      {
        $addFields: {
          document_count: { $size: '$documents' } // Menambahkan field document_count dengan jumlah dokumen
        }
      },
      {
        $project: {
          documents: 0 // Menghilangkan array dokumen, mempertahankan semua field lain
        }
      }
    ]);

    // Step 2: Populate secara manual pada setiap karyawan
    const employees = await Promise.all(
      employeesWithDocCount.map(async (employee) => {
        const populatedEmployee = await Employee.findById(employee._id)
          .populate('id_department', 'department_name')
          .populate('id_designation', 'designation_name')
          .populate('id_job_level', 'joblevel_name')
          .populate('id_bu', 'bu_name')
          .populate('id_office', 'office_name')
          .lean();

        return { ...populatedEmployee, document_count: employee.document_count }; // Menggabungkan hasil populate dengan document_count
      })
    );

    res.status(200).json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(400).json({ error: error.message });
  }
};

// Get Employees by ID
exports.getEmployeeById = async (req, res) => {
  try {
    // Step 1: Ambil data karyawan dan daftar nama dokumen dengan kategori
    const employeeWithDocuments = await Employee.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(req.params.id) } // Filter berdasarkan ID karyawan
      },
      {
        $lookup: {
          from: 'documents', // Nama koleksi dokumen
          localField: '_id', // Field yang digunakan untuk join, id karyawan
          foreignField: 'id_contact', // Field di tb_document yang mengacu ke id karyawan
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
          id_department: { $first: '$id_department' },
          id_bu: { $first: '$id_bu' },
          id_office: { $first: '$id_office' }
        }
      }
    ]);

    // Step 2: Cek apakah employee ditemukan
    if (employeeWithDocuments.length === 0) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Ambil data karyawan dan populate data terkait
    const employee = await Employee.findById(req.params.id)
      .populate('id_department', 'department_name')
      .populate('id_designation', 'designation_name')
      .populate('id_job_level', 'joblevel_name')
      .populate('id_bu', 'bu_name')
      .populate('id_office', 'office_name')
      .lean(); // Gunakan .lean() untuk mendapatkan data biasa, bukan Mongoose document

    // Populate nama lengkap (full_name) pada setiap dokumen
    const populatedDocuments = await Promise.all(employeeWithDocuments[0].documents.map(async (doc) => {
      const user = await Employee.findById(doc.id_user).select('full_name'); // Ambil full_name karyawan
      return {
        ...doc,
        full_name: user ? user.full_name : null // Menambahkan full_name pada setiap dokumen
      };
    }));

    // Menggabungkan hasil populate dengan dokumen
    const result = { 
      ...employee, 
      document_count: employeeWithDocuments[0].document_count, 
      documents: populatedDocuments // Menambahkan array dokumen dengan full_name
    };

    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching employee by ID:', error);
    res.status(400).json({ error: error.message });
  }
};

// UPDATE Employee
exports.updateEmployee = async (req, res) => {
  try {
    const { id, ...updateData } = req.body;

    if (req.file) {
      updateData.photo = req.file.filename; // Simpan nama file baru jika foto diperbarui
    }

    const updatedEmployee = await Employee.findByIdAndUpdate(id, updateData, { new: true })
      .populate('id_department', 'department_name')
      .populate('id_designation', 'designation_name')
      .populate('id_job_level', 'joblevel_name')
      .populate('id_bu', 'bu_name')
      .populate('id_office', 'office_name');

    if (!updatedEmployee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.status(200).json(updatedEmployee);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// DELETE Employee
exports.deleteEmployee = async (req, res) => {
  try {
    const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);
    if (!deletedEmployee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
