const { default: mongoose } = require("mongoose");

const locationSchema = new mongoose.Schema(
  {
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
    collection: "Location",
  }
);

module.exports = mongoose.model("Location", locationSchema);
