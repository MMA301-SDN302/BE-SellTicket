const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const carSchema = new Schema(
  {
    car_code: { type: String, default: null },
    amount_seat: { type: Number, required: true },
    car_img_url: { type: String, default: null },
    car_manufacturer: { type: String, default: null },
    buscompany_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BusCompany",
      default: null,
    },
  },
  {
    collection: "Car",
    versionKey: false,
  }
);

module.exports = mongoose.model("Car", carSchema);
