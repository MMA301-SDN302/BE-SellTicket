const otp = require("../models/Auth/OTP");

const addOtp = async (otpData) => {
  return await otp.create(otpData);
};

const getOtp = async (otpNumber, phoneNumber) => {
  return await otp.findOne({
    otp_number: otpNumber,
    mobile_phone: phoneNumber,
  });
};

const deleteOtp = async (phoneNumber) => {
  return await otp.findOneAndDelete({
    mobile_phone: phoneNumber,
  });
};

module.exports = {
  addOtp,
  getOtp,
  deleteOtp,
};
