const { CREATED, OK } = require("../core/response/success.response");
const logger = require("../logger");
const { signUp, verifyOtp, login } = require("../services/auth.service");

class AuthController {
  login = async (req, res) => {
    logger.log("AuthController", [
      "Login",
      { requestId: req.traceId },
      req.body,
    ]);
    return new OK({
      message: "login success",
      metadata: await login({ ...req.body, traceId: req.traceId }),
    }).send(req, res);
  };
  logout = async (req, res) => {};

  signUp = async (req, res) => {
    logger.log("AuthController", [
      "SignUp",
      { requestId: req.traceId },
      req.body,
    ]);
    const data = req.body;
    return new CREATED({
      message: "Verification code sent",
      metadata: await signUp({ ...data, traceId: req.traceId }),
    }).send(req, res);
  };

  forgetPassword = async (req, res) => {};

  resetPassword = async (req, res) => {};

  verifyOtp = async (req, res) => {
    logger.log("AuthController", [
      "VerifyOTP",
      { requestId: req.traceId },
      req.body,
    ]);
    return new CREATED({
      message: "User is Created",
      metadata: await verifyOtp({ ...req.body, traceId: req.traceId }),
    }).send(req, res);
  };



}

module.exports = new AuthController();
