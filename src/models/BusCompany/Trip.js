const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
    route: { type: mongoose.Schema.Types.ObjectId, ref: 'Route', required: true },
    car: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },
    busCompany: { type: mongoose.Schema.Types.ObjectId, ref: 'BusCompany', required: true },
    tripStartTime: { type: Date, required: true },
    tripEndTime: { type: Date, required: true },
    availableSeats: { type: Number, required: true }, // Số ghế trống
}, {
    timestamps: true
});

const Trip = mongoose.model('Trip', tripSchema);

module.exports = Trip;
