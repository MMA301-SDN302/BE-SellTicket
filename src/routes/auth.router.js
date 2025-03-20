const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const authController = require("../controller/auth.controller");
const { authentication } = require("../auth");
router.post("/login", asyncHandler(authController.login));
router.post("/register", asyncHandler(authController.signUp));
router.post("/verify-otp", asyncHandler(authController.verifyOtp));
router.post("/forgot-password", asyncHandler(authController.forgetPassword));
router.post("/resend-otp", asyncHandler(authController.resendOtp));
router.post("/reset-password", asyncHandler(authController.resetPassword));
router.post("/refreshToken", asyncHandler(authController.refreshTokens));
router.put("/changePassword", asyncHandler(authController.changePassword));
router.use(authentication);
router.get("/logout", asyncHandler(authController.logout));

module.exports = router;
