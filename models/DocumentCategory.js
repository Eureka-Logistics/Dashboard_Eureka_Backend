// models/DocumentCategory.js
const mongoose = require('mongoose');

const DocumentCategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  is_active: { type: Number, default: true },
});

module.exports = mongoose.model('DocumentCategory', DocumentCategorySchema);
