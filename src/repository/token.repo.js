const Token = require("../models/Auth/Token");

const createToken = async ({
  userId,
  accessToken,
  refreshToken,
  refreshTokenUsed,
}) => {
  return await Token.create({
    user: userId,
    accessToken,
    refreshToken,
    refreshTokenUsed,
  });
};

const findTokenByUserId = async (userId) => {
  return await Token.findOne({ user: userId }).lean();
};

module.exports = {
  createToken,
  findTokenByUserId,
};
