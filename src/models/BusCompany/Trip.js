const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema(
  {
    car: { type: mongoose.Schema.Types.ObjectId, ref: "Car", required: true },
    depature: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StopMap",
      default: null,
      required: true,
    },
    arrive: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StopMap",
      default: null,
      required: true,
    },
    price: { type: Number, required: true },
    isDaily: { type: Number, required: true }, // xét lịch trình tự động
    tripDate: { type: Date, required: true },
  },
  {
    collection: "Trips",
    timestamps: true,
  }
);

const Trip = mongoose.model("Trip", tripSchema);
module.exports = Trip;
