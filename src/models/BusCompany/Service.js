const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ServiceSchema = new Schema({
    service_id: {
        type: Number,
        required: true,
        unique: true
    },
    service_name: {
        type: String,
        maxlength: 255,
        default: null
    },
    service_logoUrl: {
        type: String,
        maxlength: 255,
        default: null
    },
    service_description: {
        type: String,
        maxlength: 255,
        default: null
    }
}, {
    collection: 'service'
});

const Service = mongoose.model('Service', ServiceSchema);

module.exports = Service;