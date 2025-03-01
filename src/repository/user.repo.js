const User = require("../models/Auth/User");

const updateUser = async (_id, data) => {
    return await User.findOneAndUpdate({ _id }, data, { new: true });
};
module.exports = {
    updateUser
}