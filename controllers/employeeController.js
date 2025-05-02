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
    const idInput = req.params.id;
    const isObjectId = mongoose.Types.ObjectId.isValid(idInput);

    // Gunakan kondisi match fleksibel
    const matchCondition = isObjectId
      ? { $or: [{ _id: new mongoose.Types.ObjectId(idInput) }, { emp_id: idInput }] }
      : { emp_id: { $regex: new RegExp(`^${idInput}$`, 'i') } };

    // Step 1: Ambil data karyawan dan dokumen + kategori
    const employeeWithDocuments = await Employee.aggregate([
      { $match: matchCondition },
      {
        $lookup: {
          from: 'documents',
          localField: '_id',
          foreignField: 'id_contact',
          as: 'documents'
        }
      },
      {
        $unwind: {
          path: '$documents',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: 'documentcategories',
          localField: 'documents.id_document_category',
          foreignField: '_id',
          as: 'documents.category'
        }
      },
      {
        $unwind: {
          path: '$documents.category',
          preserveNullAndEmptyArrays: true
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
              category_name: '$documents.category.name',
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

    // Step 2: Jika tidak ditemukan
    if (employeeWithDocuments.length === 0) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Step 3: Cari data karyawan lengkap dengan populate
    const employee = await Employee.findOne(matchCondition)
      .populate('id_department', 'department_name')
      .populate('id_designation', 'designation_name')
      .populate('id_job_level', 'joblevel_name')
      .populate('id_bu', 'bu_name')
      .populate('id_office', 'office_name')
      .lean();

    // Step 4: Tambahkan full_name ke dokumen (id_user)
    const populatedDocuments = await Promise.all(
      employeeWithDocuments[0].documents.map(async (doc) => {
        const user = await Employee.findById(doc.id_user).select('full_name');
        return {
          ...doc,
          full_name: user ? user.full_name : null
        };
      })
    );

    // Step 5: Gabungkan hasil
    const result = {
      ...employee,
      document_count: employeeWithDocuments[0].document_count,
      documents: populatedDocuments
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
