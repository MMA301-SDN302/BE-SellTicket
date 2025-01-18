const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const driverSchema = new Schema(
  {
    driver_id: {
      type: Number,
      default: null,
    },
    driver_name: {
      type: String,
      default: null,
    },
    driver_avaUrl: {
      type: String,
      default: null,
    },
    driver_description: {
      type: String,
      default: null,
    },
    busCompany: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BusCompany",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Driver = mongoose.model("Driver", driverSchema);

module.exports = Driver;