const mongoose = require('mongoose');

const officeSchema = new mongoose.Schema({
  office_code: { type: String, required: true },
  office_name: { type: String, required: true },
  is_active: { type: Number, default: 1 },
  date_added: { type: Date, default: Date.now },
  date_modified: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Office', officeSchema);
