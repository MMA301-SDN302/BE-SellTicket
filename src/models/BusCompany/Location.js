const { default: mongoose } = require("mongoose");

const locationSchema = new mongoose.Schema(
  {
    location_id: {
      type: Number,
      required: true,
      unique: true,
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

module.exports = mongoose.model("Location", locationSchema);
