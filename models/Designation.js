const mongoose = require('mongoose');

const designationSchema = new mongoose.Schema({
  designation_code: { type: String, required: true },
  designation_name: { type: String, required: true },
  is_active: { type: Number, default: 1 },
  date_added: { type: Date, default: Date.now },
  date_modified: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Designation', designationSchema);
