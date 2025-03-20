"use strict";
const { model, Schema } = require("mongoose");
const DOCUMENT_NAME = "OTP";
const COLLECTION_NAME = "OTPs";
const otpSchema = new Schema(
  {
    otp_number: {
      type: String,
      required: true,
      unique: true,
    },
    mobile_phone: {
      type: String,
      required: true,
    },
    otp_sign: {
      type: String,
    },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);
otpSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 });
module.exports = model(DOCUMENT_NAME, otpSchema);
