const mongoose = require('mongoose');
const { Schema } = mongoose;

const jobpositionSchema = new Schema({
    jobposition_code: { type: String, required: true },
    jobposition_name: { type: String, required: true },
    is_active: { type: Number, default: 1 },
    date_added: { type: Date, default: Date.now },
    date_modified: { type: Date, default: Date.now },
});

// Ekspor model
module.exports = mongoose.model('JobPosition', jobpositionSchema);
