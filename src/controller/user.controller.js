const { OK } = require("../core/response/success.response");
const { update } = require("../services/user.service");

class UserController {
    update = async (req, res) => {
        return new OK({
            message: "update success",
            metadata: await update(req.params._id, req.body),
        }).send(req, res);
    };

}
module.exports = new UserController();
