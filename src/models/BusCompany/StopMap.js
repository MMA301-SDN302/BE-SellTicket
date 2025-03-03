const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const stopMapSchema = new Schema(
  {
    stops: [
      {
        stop_id: { type: Number, required: true },
        stop_name: { type: String, required: true },
        latitude: { type: Number, required: true }, // Thêm trường latitude
        longitude: { type: Number, required: true }, // Thêm trường longitude
        stop_time: { type: Date, default: null },
      },
    ],
  },
  {
    collection: "Stopmaps",
    timestamps: true,
  }
);

const StopMap = mongoose.model("StopMap", stopMapSchema);

module.exports = StopMap;
