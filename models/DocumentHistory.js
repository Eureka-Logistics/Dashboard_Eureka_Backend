const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DocumentHistorySchema = new Schema({
  document_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Document', required: true },
  id_employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  previous_file_name: { type: String, required: true },
  date_uploaded: { type: Date, default: Date.now },
});

module.exports = mongoose.model('DocumentHistory', DocumentHistorySchema);
