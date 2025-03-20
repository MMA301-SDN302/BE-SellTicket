const User = require("../models/Auth/User");

const addUser = async (user) => {
  return await User.create(user);
};

const isExistUser = async (mobilePhone) => {
  return await User.findOne({ mobilePhone }).lean();
};

const findUserByPhoneNumber = async (phoneNumber) => {
  return await User.findOne({ mobilePhone: phoneNumber }).lean();
};

const findUserByIdAndPhoneNumber = async (userId, phoneNumber) => {
  return await User.findOne({ _id: userId, mobilePhone: phoneNumber }).lean();
};

const updatePassword = async (userId, password) => {
  return await User.findOneAndUpdate({ _id: userId }, { password });
};
module.exports = {
  addUser,
  isExistUser,
  findUserByPhoneNumber,
  findUserByIdAndPhoneNumber,
  updatePassword
};
