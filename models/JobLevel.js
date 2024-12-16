const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const jobLevelSchema = new mongoose.Schema({
  joblevel_code: { type: String, required: true },
  joblevel_name: { type: String, required: true },
  id_bu: [{ type: Schema.Types.ObjectId, ref: 'BU'}],
  is_active: { type: Number, default: 1 },
  date_added: { type: Date, default: Date.now },
  date_modified: { type: Date, default: Date.now },
});

module.exports = mongoose.model('JobLevel', jobLevelSchema);
