const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const routeSchema = new Schema(
  {
    policy: { type: String, default: null },
    car: { type: Schema.Types.ObjectId, ref: "Car", default: null },
    name: { type: String, required: true },
    routeDescription: { type: String, default: null },
    routeStartTime: { type: Date, default: null },
    routeEndTime: { type: Date, default: null },
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
    trip: { type: Schema.Types.ObjectId, ref: "Trip", required: true },

    remainingSeat: { type: Number, required: true, default: null },
  },
  {
    collection: "Routes",
    timestamps: true,
  }
);

const Route = mongoose.model("Route", routeSchema);

module.exports = Route;
