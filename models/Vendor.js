const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VendorSchema = new Schema({
    vendor_name: { type: String, required: true },
    pic_title: { type: String },
    pic_last_name: { type: String },
    pic_position: { type: String },
    payment_address: { type: String },
    address: { type: String },
    id_city: { type: Number },
    id_province: { type: Number },
    id_country: { type: Number },
    phone: { type: String },
    fax: { type: String },
    mobile: { type: String },
    email: { type: String },
    business_type: { type: String },
    term_of_payment: { type: String },
    year_founded: { type: Number },
    id_bu: { type: Schema.Types.ObjectId, ref: 'BU' },
    tax_no: { type: String },
    bank_account_name: { type: String },
    bank_account_number: { type: String },
    bank_account_nameholder: { type: String },
    bank_account_brench: { type: String },
    is_active: { type: Number, default: 1 },
    internal_pic: { type: String },
    date_added: { type: Date, default: Date.now },
    date_modified: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Vendor', VendorSchema);
