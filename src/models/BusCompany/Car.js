const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const carSchema = new Schema({
    car_id: { type: Number, required: true, unique: true },
    car_code: { type: String, default: null },
    amount_seat: { type: Number, required: true },
    car_img_url: { type: String, default: null },
    car_manufacturer: { type: String, default: null },
    bus_company_id: { type: mongoose.Schema.Types.ObjectId, ref: 'BusCompany', default: null }
}, {
    collection: 'car',
    versionKey: false
});

module.exports = mongoose.model('Car', carSchema);