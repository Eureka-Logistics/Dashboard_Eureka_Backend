const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CustomerSchema = new Schema({
    customer_name: { type: String, required: true },
    pic_title: { type: String },
    pic_last_name: { type: String },
    pic_position: { type: String },
    billing_address: { type: String },
    address: { type: String },
    id_subdistrict: { type: Number },
    id_city: { type: Number },
    id_province: { type: Number },
    phone: { type: String },
    fax: { type: String },
    mobile: { type: String },
    email: { type: String },
    business_type: { type: String },
    term_of_payment: { type: String },
    year_founded: { type: Number },
    id_bu: { type: Schema.Types.ObjectId, ref: 'BU' },
    max_credit_limit: { type: Number },
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

module.exports = mongoose.model('Customer', CustomerSchema);
