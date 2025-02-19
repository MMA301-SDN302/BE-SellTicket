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

module.exports = {
  addUser,
  isExistUser,
  findUserByPhoneNumber,
};
