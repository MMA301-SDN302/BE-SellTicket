const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const voucherSchema = new Schema({
    voucher_code: { type: String, required: true, unique: true },
    saleUp: { type: Number, required: true },
    startTime: { type: Date },
    endTime: { type: Date },
    voucher_condition: { type: String },
    busCompany: { type: mongoose.Schema.Types.ObjectId, ref: 'BusCompany' }
}, {
    timestamps: true
});

const Voucher = mongoose.model('Voucher', voucherSchema);

module.exports = Voucher;
