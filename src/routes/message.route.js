const express = require("express");
const router = express.Router();
const messageController = require("../controller/message.controller");
const { asyncHandler } = require("../auth/checkAuth");

// Get all conversations for a user
router.get("/conversations/:userId", asyncHandler(messageController.getUserConversations));

// Get messages between two users
router.get("/:senderId/:receiverId", asyncHandler(messageController.getMessages));

// Send a message
router.post("/", asyncHandler(messageController.sendMessage));

// Mark a message as read
router.patch("/read/:messageId", asyncHandler(messageController.markMessageAsRead));

module.exports = router; 