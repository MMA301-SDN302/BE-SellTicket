const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const { authentication } = require("../auth");
const userController = require("../controller/user.controller");

// Authentication middleware for protected routes
router.use(authentication);

// Profile routes
router.get("/", asyncHandler(userController.getProfile));
router.put("/", asyncHandler(userController.updateProfile));

router.put("/:_id", asyncHandler(userController.update));
router.get("/online", asyncHandler(userController.getOnlineUsers));

module.exports = router;
    