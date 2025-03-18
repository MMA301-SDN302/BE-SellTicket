const { OK } = require("../core/response/success.response");
const { update } = require("../services/user.service");

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
}
module.exports = new UserController();
