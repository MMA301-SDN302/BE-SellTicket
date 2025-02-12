"use strict";
const asyncHandler = require("express-async-handler");
const { HEADER } = require("../core/constans/header.constant");
const {
  NotFoundError,
  UnauthorizedError,
} = require("../core/response/error.response");

const authentication = asyncHandler(async (req, res, next) => {
  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) {
    throw new UnauthorizedError("Invalid request");
  } else {
    let decodeUser = {};
    const jwt = accessToken.split(" ")[1];

    decodeUser = await CryptoService.verifyToken(
      jwt,
      keyStore.publicKey,
      (err, user) => {
        if (err && err.name === "TokenExpiredError") {
          throw new UnauthorizedError("JWT invalid");
        }
        if (err) {
          throw new UnauthorizedError("Invalid request");
        }
        return user;
      }
    );
    if (profileHash !== decodeUser.profileHash) {
      throw new UnauthorizedError("Invalid request");
    }
    req.keyStore = keyStore;
    req.user = decodeUser;
    return next();
  }
});


module.exports = { authentication };
