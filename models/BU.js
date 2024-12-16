const mongoose = require('mongoose');

const buSchema = new mongoose.Schema({
  bu_code: { type: String, required: true },
  bu_name: { type: String, required: true },
  is_active: { type: Number, default: 1 },
  date_added: { type: Date, default: Date.now },
  date_modified: { type: Date, default: Date.now },
});

module.exports = mongoose.model('BU', buSchema);
