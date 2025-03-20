const _ = require("lodash");

const isMissingObjectData = async (object = {}) => {
  const result = [];
  const keys = Object.keys(object);
  keys.forEach((key) => {
    if (_.isEmpty(object[key])) result.push(key);
  });
  return result;
};

const isPhoneNumber = async (phone) => {
  const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/g;
  return phoneRegex.test(phone);
};
module.exports = {
  isMissingObjectData,
  isPhoneNumber,
};
