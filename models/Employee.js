const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Skema untuk Employee
const EmployeeSchema = new Schema({
  emp_id: { type: String},
  full_name: { type: String, required: true },
  first_name: { type: String },
  last_name: { type: String },
  sex: { type: String, enum: ['Male', 'Female'], required: true },
  birth_date: { type: Date },
  religion: { type: String, enum: ['Islam', 'Protestant', 'Catholic', 'Hindu', 'Christian'] },
  marital_status: { type: String, enum: ['Single', 'Married'] },
  no_telp: { type: String },
  hire_date: { type: Date },
  is_active: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  employee_status: { type: String },
  id_department: { type: Schema.Types.ObjectId, ref: 'Department' }, // Relasi dengan Department
  id_designation: { type: Schema.Types.ObjectId, ref: 'Designation' }, // Relasi dengan Designation
  id_job_level: { type: Schema.Types.ObjectId, ref: 'JobLevel' }, // Relasi dengan JobLevel
  id_bu: { type: Schema.Types.ObjectId, ref: 'BU' }, // Relasi dengan BusinessUnit
  id_office: { type: Schema.Types.ObjectId, ref: 'Office' }, // Relasi dengan Office
  grade: { type: String },
  education: { type: String },
  education_major: { type: String },
  collage: { type: String },
  bpjs_tk: { type: String },
  bpjs_kes: { type: String },
  email: { type: String, unique: true },
  address: { type: String },
  id_subdistrict: { type: Number },
  id_city: { type: Number },
  id_province: { type: Number },
  tax_category: { type: String },
  pph21: { type: Number },
  photo: { type: String },
  date_added: { type: Date, default: Date.now },
  date_modified: { type: Date }
});

module.exports = mongoose.model('Employee', EmployeeSchema);
