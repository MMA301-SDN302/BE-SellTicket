const { ErrorCodes } = require("../core/errorConstant/httpStatusCode");
const { BadRequestError } = require("../core/response/error.response");
const { updateUser } = require("../repository/user.repo");

const update = async (_id, data) => {
    if (!data.phoneNumber) {
        throw new BadRequestError("Missing mobilePhone", ErrorCodes.INVALID_PHONE_NUMBER);
    }

    const user = await updateUser(_id, data)

    console.log("userrr", user);

    if (!user) {
        throw new BadRequestError("Invalid User", ErrorCodes.INVALID_CREDENTIALS);
    }
    return {
        userId: user._id,
        phoneNumber: user.mobilePhone,
        displayName: `${user.firstName} ${user.lastName}`,
        gender: user.sex,
        dateOfBirth: user.dateOfBirth,
        avatar: user.avatar,
        email: user.email || undefined,
    };
};


module.exports = {
    update
};