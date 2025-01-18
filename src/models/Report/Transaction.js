import mongoose from 'mongoose';

const { Schema } = mongoose;

const transactionSchema = new Schema({
    transaction_id: { type: Number, required: true, unique: true },
    transaction_point: { type: Number, required: true },
    transaction_status: { type: String, default: null },
    transaction_time_edit: { type: Date, default: null },
    transaction_vat: { type: Number, required: true },
    customer_id: { type: Number, default: null },
    payment_method_id: { type: Number, default: null },
    voucher_code: { type: String, default: null, unique: true }
}, {
    collection: 'transaction',
    timestamps: true
});

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;