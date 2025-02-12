const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const authController = require("../controller/auth.controller");

router.post("/login", asyncHandler(authController.login));
router.post("/register", asyncHandler(authController.signUp));
router.post("/forgot-password", asyncHandler(authController.forgetPassword));
router.get("/logout", asyncHandler(authController.logout));
router.post("/reset-password", asyncHandler(authController.resetPassword));
router.post("/verify-otp", asyncHandler(authController.verifyOtp));

module.exports = router;
