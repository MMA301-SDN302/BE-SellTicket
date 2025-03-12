const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema(
  {
    car: { type: mongoose.Schema.Types.ObjectId, ref: "Car", required: true },
    stopMap: {
      type: [
        {
          name: { type: String, required: true },
          time: { type: String, required: true },
          offsetTime: { type: Number, required: true },
          code: { type: String, required: true },
          AODAddress: { type: String, required: true },
        },
      ],
      required: true,
    },
    price: { type: Number, required: true },
    weekTimeRun: [
      {
        type: String,
        enum: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        required: true,
      },
    ], // xét lịch trình tự động
  },
  {
    collection: "Trips",
    timestamps: true,
  }
);

const Trip = mongoose.model("Trip", tripSchema);
module.exports = Trip;
