const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const busCompanySchema = new Schema({
    bus_company_id: { type: Number, required: true, unique: true },
    bus_company_status: { type: String, default: null },
    bus_company_fullname: { type: String, default: null },
    bus_company_dob: { type: String, default: null },
    bus_company_img_url: { type: String, default: null },
    bus_company_description: { type: String, default: null },
    bus_company_nationally: { type: String, default: null },
    bus_company_name: { type: String, default: null },
    bus_company_contract: { type: String, default: null },
    bus_company_location: { type: String, default: null },
    location_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Location', default: null }
}, { collection: 'buscompany' });

const BusCompany = mongoose.model('BusCompany', busCompanySchema);

module.exports = BusCompany;
