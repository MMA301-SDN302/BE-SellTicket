const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const seatSchema = new Schema({
    route: { type: mongoose.Schema.Types.ObjectId, ref: "Route", required: true, default: null },
    floor: { type: Number, required: true },
    seatNumber: { type: String, required: true },
    isAvailable: { type: Boolean, default: true },
},
    {
        collection: "Seat",
        timestamps: true,
    });

const Seat = mongoose.model("Seat", seatSchema);
module.exports = Seat;
