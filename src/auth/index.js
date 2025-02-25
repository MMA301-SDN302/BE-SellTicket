"use strict";
const asyncHandler = require("express-async-handler");
const { HEADER } = require("../core/constans/header.constant");
const { UnauthorizedError } = require("../core/response/error.response");
const { ErrorCodes } = require("../core/errorConstant/httpStatusCode");
const { verifyJwtToken } = require("../services/bcrypt.service");

const authentication = asyncHandler(async (req, res, next) => {
  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) {
    throw new UnauthorizedError("Invalid request", ErrorCodes.UNAUTHORIZED);
  } else {
    let decodeUser = {};
    const jwt = accessToken.split(" ")[1];

    decodeUser = await verifyJwtToken(jwt, (err, decode) => {
      if (err && err.name === "TokenExpiredError") {
        throw new UnauthorizedError("JWT invalid" , ErrorCodes.JWT_EXPIRED);
      }
      if (err) {
        throw new UnauthorizedError("JWT invalid" , ErrorCodes.UNAUTHORIZED);
      }
      return decode;
    });
    req.user = decodeUser;
    return next();
  }
});

module.exports = { authentication };
