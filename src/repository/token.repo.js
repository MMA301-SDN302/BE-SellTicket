const Token = require("../models/Auth/Token");

const createToken = async ({
  userId,
  accessToken,
  refreshToken,
  refreshTokenUsed = [],
}) => {
  // update if token is already exist or create new token
  return await Token.findOneAndUpdate(
    { user: userId },
    {
      user: userId,
      accessToken,
      refreshToken,
      refreshTokenUsed,
    },
    { upsert: true, new: true }
  );
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
