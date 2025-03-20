const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const customerSchema = new Schema({
    customer_id: { type: Number, required: true, unique: true },
    customer_status: { type: String, default: null },
    customer_fullname: { type: String, default: null },
    customer_dob: { type: Date, default: null },
    customer_img_ava: { type: String, default: null },
    customer_nationality: { type: String, default: null },
    customer_gender: { type: String, default: null },
    customer_description: { type: String, default: null },
    verify_purchased: { type: Boolean, required: true },
    point: { type: Number, required: true },
    type_customer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'TypeCustomer', default: null },
    transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' }]
}, {
    collection: 'customer',
    timestamps: true
});

module.exports = mongoose.model('Customer', customerSchema);
