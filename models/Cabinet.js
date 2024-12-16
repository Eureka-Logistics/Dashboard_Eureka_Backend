const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CabinetSchema = new mongoose.Schema({
  id_cabinet: { type: Number },
  cabinet_name: { type: String, required: true },
  id_office: { type: Schema.Types.ObjectId, ref: 'Office' },
  is_active: { type: Number, required: true, default: 1 }
});

module.exports = mongoose.model('Cabinet', CabinetSchema);
