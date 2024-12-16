const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DocumentSchema = new mongoose.Schema({
  document_name: { type: String, required: true },
  document_code: { type: String, required: true },
  id_document_category: { type: mongoose.Schema.Types.ObjectId, ref: 'DocumentCategory', required: true },
  id_contact: { type: Schema.Types.ObjectId, required: true, refPath: 'modelType' },  // Referensi dinamis ke model (Employee, Vendor, Customer)
  modelType: { type: String, required: true, enum: ['employee', 'vendor', 'customer'] },  // Menentukan tipe model
  id_office: { type: mongoose.Schema.Types.ObjectId, ref: 'Office' },
  id_cabinet: { type: mongoose.Schema.Types.ObjectId, ref: 'Cabinet' },
  file_name: { type: String },
  date_added: { type: String, default: () => new Date().toISOString().split('T')[0] },  // Format YYYY-MM-DD
  date_modified: { type: String, default: () => new Date().toISOString().split('T')[0] },
  id_user: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },  // Mengganti id_user menjadi ObjectId yang merujuk ke Employee
  note: { type: String },
  pic_name: { type: String },
  start_date: { type: Date },
  end_date: { type: Date, default: null },

  // Status approval dan ID karyawan yang memberikan approval
  approval_status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },  // Status approval
  approved_by: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },  // ID karyawan yang menyetujui
});

// Middleware untuk memastikan format date_added dan date_modified saat save
DocumentSchema.pre('save', function (next) {
  const currentDate = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD
  this.date_added = this.date_added || currentDate;
  this.date_modified = currentDate;

  if (!this.end_date) {
    this.end_date = null;
  }
  next();
});

// Middleware untuk memperbarui date_modified saat update
DocumentSchema.pre('findOneAndUpdate', function (next) {
  this._update.date_modified = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD
  next();
});

// Function untuk melakukan populate berdasarkan modelType
DocumentSchema.methods.populateContact = function() {
  const modelName = this.modelType.charAt(0).toUpperCase() + this.modelType.slice(1);
  if (['Employee', 'Vendor', 'Customer'].includes(modelName)) {
    return this.populate({
      path: 'id_contact',
      model: modelName,
      select: 'full_name email'
    });
  } else {
    return Promise.reject(new Error('Invalid modelType for contact.'));
  }
};

module.exports = mongoose.model('Document', DocumentSchema);
