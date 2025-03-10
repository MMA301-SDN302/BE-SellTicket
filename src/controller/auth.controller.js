const {
  CREATED,
  OK,
  NO_CONTENT,
} = require("../core/response/success.response");
const logger = require("../logger");
const {
  signUp,
  verifyOtp,
  login,
  resetPassword,
  forgetPassword,
  refreshToken,
  resendOtp,
  changePassword,
} = require("../services/auth.service");

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
  logout = async (req, res) => { };

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

  forgetPassword = async (req, res) => {
    logger.log("AuthController", [
      "ForgetPassword",
      { requestId: req.traceId },
      req.body,
    ]);
    return new OK({
      message: "Verification code sent",
      metadata: await forgetPassword({ ...req.body, traceId: req.traceId }),
    }).send(req, res);
  };

  resetPassword = async (req, res) => {
    logger.log("AuthController", [
      "ResetPassword",
      { requestId: req.traceId },
      req.body,
    ]);
    return new NO_CONTENT({
      message: "Password is reset",
      metadata: await resetPassword({ ...req.body, traceId: req.traceId }),
    }).send(req, res);
  };

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

  resendOtp = async (req, res) => {
    logger.log("AuthController", [
      "ResendOTP",
      { requestId: req.traceId },
      req.body,
    ]);
    return new OK({
      message: "Verification code sent",
      metadata: await resendOtp({ ...req.body, traceId: req.traceId }),
    }).send(req, res);
  };

  refreshTokens = async (req, res) => {
    logger.log("AuthController", [
      "RefreshTokens",
      { requestId: req.traceId },
      req.body,
    ]);
    return new OK({
      message: "Token is refreshed",
      metadata: await refreshToken({ ...req.body, traceId: req.traceId }),
    }).send(req, res);
  };

  changePassword = async (req, res) => {
    logger.log("AuthController", [
      "changePassword",
      { requestId: req.traceId },
      req.body,
    ]);
    return new NO_CONTENT({
      message: "Password is changed",
      metadata: await changePassword({ ...req.body, traceId: req.traceId }),
    }).send(req, res);
  }
}

module.exports = new AuthController();
