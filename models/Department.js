const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Skema untuk Department
const DepartmentSchema = new Schema({
  department_code: { type: String, required: true, unique: true },
  department_name: { type: String, required: true },
  is_active: { type: Number, default: true }
});

module.exports = mongoose.model('Department', DepartmentSchema);
