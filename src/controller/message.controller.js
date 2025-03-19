const { SuccessResponse } = require("../core/response/success.response");
const MessageService = require("../services/message.service");
const { BadRequestError } = require("../core/response/error.response");

class MessageController {
  // Get all conversations for a user
  getUserConversations = async (req, res, next) => {
    try {
      const { userId } = req.params;
      
      if (!userId) {
        throw new BadRequestError("User ID is required");
      }
      
      console.log(`Controller: Getting conversations for user ${userId}`);
      const conversations = await MessageService.getUserConversations(userId);
      
      console.log(`Controller: Successfully retrieved ${conversations.length} conversations`);
      return new SuccessResponse({
        message: "Get user conversations successfully",
        metadata: conversations,
      }).send(res);
    } catch (error) {
      console.error("Controller error in getUserConversations:", error);
      next(error);
    }
  };

  // Get all conversations for admin
  getAdminConversations = async (req, res, next) => {
    try {
      const adminId = req.user._id;
      
      if (!req.user.role || !req.user.role.includes('admin')) {
        throw new BadRequestError("Unauthorized: Admin access required");
      }
      
      const conversations = await MessageService.getAdminConversations(adminId);
      return new SuccessResponse({
        message: "Admin conversations retrieved successfully",
        metadata: conversations,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  // Get messages between two users
  getMessages = async (req, res, next) => {
    try {
      const { senderId, receiverId } = req.params;
      
      if (!senderId || !receiverId) {
        throw new BadRequestError("Sender ID and Receiver ID are required");
      }
      
      const messages = await MessageService.getMessages(senderId, receiverId);
      return new SuccessResponse({
        message: "Get messages successfully",
        metadata: messages,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  // Send a message
  sendMessage = async (req, res, next) => {
    try {
      const { senderId, receiverId, content } = req.body;
      
      if (!senderId || !receiverId || !content) {
        throw new BadRequestError("Sender ID, Receiver ID, and content are required");
      }
      
      const message = await MessageService.sendMessage({
        senderId,
        receiverId,
        content,
      });
      
      return new SuccessResponse({
        message: "Message sent successfully",
        metadata: message,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  // Mark a message as read
  markMessageAsRead = async (req, res, next) => {
    try {
      const { messageId } = req.params;
      
      if (!messageId) {
        throw new BadRequestError("Message ID is required");
      }
      
      const message = await MessageService.markMessageAsRead(messageId);
      return new SuccessResponse({
        message: "Message marked as read successfully",
        metadata: message,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new MessageController();
