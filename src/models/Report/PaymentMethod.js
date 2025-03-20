const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PaymentMethodSchema = new Schema(
  {
    paymentMethod_id: {
      type: Number,
      default: null,
    },
    paymentMethod_name: {
      type: String,
      default: null,
    },
    paymentMethod_description: {
      type: String,
      default: null,
    },
    paymentMethod_ava: {
      type: String,
      default: null,
    },
  },
  {
    collection: "paymentMethod",
  }
);

module.exports = mongoose.model("PaymentMethod", PaymentMethodSchema);
