const express = require("express");

const controller = require("../controller/message.controller")
const router = express.Router();
const asyncHandler = require("express-async-handler");

router.post("/send", asyncHandler(controller.sendMessage));
router.get("/history", asyncHandler(controller.getMessages));
router.put("/read/:messageId", asyncHandler(controller.markMessageAsRead));
router.get("/conversations/:userId", asyncHandler(controller.getUserConversations));

module.exports = router;

