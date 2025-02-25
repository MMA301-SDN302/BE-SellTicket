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

const deleteTokenByUserId = async (userId) => {
  return await Token.findOneAndDelete({ user: userId });
};

const updateRefreshToken = async (userId, refreshToken, refreshTokenUsed) => {
  return await Token.findOneAndUpdate(
    { user: userId },
    { refreshToken, refreshTokenUsed: refreshTokenUsed }
  );
};

module.exports = {
  createToken,
  findTokenByUserId,
  deleteTokenByUserId,
  updateRefreshToken,
};
