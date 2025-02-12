const User = require("../models/Auth/User");

const addUser = async (user) => {
  return await User.create(user);
};

const isExistUser = async (mobilePhone) => {
  return await User.findOne({ mobilePhone });
};

module.exports = {
  addUser,
  isExistUser,
};
