const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const routeSchema = new Schema({
    policy: { type: String, default: null },
    car: { type: Schema.Types.ObjectId, ref: 'Car', default: null },
    name: { type: String, required: true },
    routeDescription: { type: String, default: null },
    routeStartTime: { type: Date, default: null },
    routeEndTime: { type: Date, default: null },
    startLocation: { type: Schema.Types.ObjectId, ref: 'Location', default: null },
    endLocation: { type: Schema.Types.ObjectId, ref: 'Location', default: null },
    stopMap: { type: Schema.Types.ObjectId, ref: 'StopMap', default: null },
    price: { type: Number, required: true },
    remainingSeat:  { type: Number, required: true, default: null },
}, {
    collection: "Routes",
    timestamps: true
});

const Route = mongoose.model('Route', routeSchema);

module.exports = Route;