const { OK } = require("../core/response/success.response");
const { update, getUser, updateUser } = require("../services/user.service");
const User = require("../models/Auth/User");

class UserController {
  update = async (req, res) => {
    return new OK({
      message: "update success",
      metadata: await update(req.params._id, req.body),
    }).send(req, res);
  };

  getOnlineUsers = async (req, res) => {
    const onlineUsers = await User.find({ isOnline: true }).select(
      "firstName lastName mobilePhone"
    );
    return new OK({
      message: "Online users retrieved successfully",
      metadata: onlineUsers,
    }).send(req, res);
  };

  getProfile = async (req, res) => {
    // The userId is attached in the authentication middleware
    const userId = req.user.userId;
    
    const user = await User.findById(userId).select("-password");
    
    return new OK({
      message: "Profile retrieved successfully",
      metadata: user,
    }).send(req, res);
  };

  updateProfile = async (req, res) => {
    const userId = req.user.userId;
    const updateData = req.body;
    
    // Prevent updating sensitive fields
    delete updateData.password;
    delete updateData.role;
    
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true }
    ).select("-password");
    
    return new OK({
      message: "Profile updated successfully",
      metadata: updatedUser,
    }).send(req, res);
  };
}

module.exports = new UserController();
