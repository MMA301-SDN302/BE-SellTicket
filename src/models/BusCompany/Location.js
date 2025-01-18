import mongoose from "mongoose";

const locationSchema = new mongoose.Schema(
  {
    location_id: {
      type: Number,
      required: true,
      unique: true,
      autoIncrement: true,
    },
    location_description: {
      type: String,
      default: null,
    },
    location_img_url: {
      type: String,
      default: null,
    },
    location_name: {
      type: String,
      default: null,
    },
  },
  {
    collection: "location",
  }
);

const Location = mongoose.model("Location", locationSchema);

module.exports = Location;

