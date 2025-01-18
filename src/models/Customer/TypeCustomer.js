const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TypeCustomerSchema = new Schema({
    typeCustomer_id: {
        type: Number,
        required: true,
        unique: true,
        autoIncrement: true
    },
    typeCustomer_name: {
        type: String,
        default: null
    },
    typeCustomer_description: {
        type: String,
        default: null
    },
    customers: [{
        type: Schema.Types.ObjectId,
        ref: 'Customer'
    }]
});

module.exports = mongoose.model('TypeCustomer', TypeCustomerSchema);