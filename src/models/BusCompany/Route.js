const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const routeSchema = new Schema({
    isDaily: { type: Boolean, required: true },
    policy: { type: String, default: null },
    routeDescription: { type: String, default: null },
    routeEndTime: { type: Date, default: null },
    routeStartTime: { type: Date, default: null },
    busCompany: { type: Schema.Types.ObjectId, ref: 'BusCompany', default: null },
    car: { type: Schema.Types.ObjectId, ref: 'Car', default: null },
    endLocation: { type: Schema.Types.ObjectId, ref: 'Location', default: null },
    startLocation: { type: Schema.Types.ObjectId, ref: 'Location', default: null },
}, {
    timestamps: true
});

const Route = mongoose.model('Route', routeSchema);

module.exports = Route;