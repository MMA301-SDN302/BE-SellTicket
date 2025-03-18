const User = require("../models/Auth/User");
const Message = require("../models/Message/message");
const { io } = require("../config/socket.config");
const mongoose = require('mongoose');

const userSocketMap = {};
const adminSocketMap = {};

// Function to get an admin user ID
const getAdminUserId = async () => {
  const admin = await User.findOne({ role: { $in: ['admin'] } });
  return admin ? admin._id : null;
};

const setupSocket = (messageService) => {
  io.on("connection", async (socket) => {
    const userId = socket.handshake.query.userId;
    const role = socket.handshake.query.role; // Nhận role từ client

    console.log(`User connected: ${userId} - Role: ${role}`);

    if (userId && userId !== "undefined") {
      if (role === "admin") {
        if (!adminSocketMap[userId]) adminSocketMap[userId] = [];
        adminSocketMap[userId].push(socket.id);
      } else {
        if (!userSocketMap[userId]) userSocketMap[userId] = [];
        userSocketMap[userId].push(socket.id);
      }

      await User.findByIdAndUpdate(userId, { isOnline: true });
    }

    io.emit("getOnlineUsers", {
      users: Object.keys(userSocketMap),
      admin: Object.keys(adminSocketMap),
    });

    // Initialize conversation for new users
    socket.on("initConversation", async ({ userId }) => {
      try {
        if (!userId) {
          socket.emit("messageError", { error: "User ID is required" });
          return;
        }
        
        await messageService.createDefaultConversation(userId);
      } catch (error) {
        console.error("Error initializing conversation:", error);
        socket.emit("messageError", { error: error.message });
      }
    });

    // Load message history
    socket.on("loadMessages", async ({ senderId, receiverId }) => {
      try {
        if (!senderId) {
          socket.emit("messageError", { error: "Sender ID is required" });
          return;
        }
        
        const messages = await messageService.getMessageHistory({ 
          senderId, 
          receiverId: receiverId || 'admin' 
        });
        
        socket.emit("loadMessages", messages);
      } catch (error) {
        console.error("Error loading messages:", error);
        socket.emit("messageError", { error: error.message });
      }
    });

    socket.on("sendMessage", async ({ senderId, receiverId, content }) => {
      try {
        console.log("Message received:", { senderId, receiverId, content });
        
        // Use the message service to save the message to database
        const message = await messageService.sendMessage({
          senderId,
          receiverId,
          content
        });
        
        console.log("Message saved:", message);
        
        // Get socket ID of the receiver and emit message event
        const receiverSocketId = getReceiverSocketId(message.receiverId.toString());
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("receiveMessage", message);
        }
      } catch (error) {
        console.error("Error in sendMessage event:", error);
        socket.emit("messageError", { error: error.message });
      }
    });

    socket.on("markMessageAsRead", async ({ messageId }) => {
      try {
        if (!messageId) {
          socket.emit("messageError", { error: "Message ID is required" });
          return;
        }
        
        const message = await messageService.markMessageAsRead(messageId);
        
        // Notify the sender that their message was read
        const senderSocketId = getReceiverSocketId(message.senderId.toString());
        if (senderSocketId) {
          io.to(senderSocketId).emit("messageRead", { messageId });
        }
      } catch (error) {
        console.error("Error marking message as read:", error);
        socket.emit("messageError", { error: error.message });
      }
    });

    socket.on("adminConnect", async ({ adminId }) => {
      try {
        // Lấy tất cả conversations cho admin
        const conversations = await Conversation.find({})
          .populate('participants', 'firstName lastName avatar isOnline')
          .populate('lastMessage');
          
        socket.emit("adminConversations", conversations);
      } catch (error) {
        console.error("Error loading admin conversations:", error);
        socket.emit("messageError", { error: error.message });
      }
    });

    socket.on("disconnect", async () => {
      if (userId) {
        userSocketMap[userId] = (userSocketMap[userId] || []).filter(
          (id) => id !== socket.id
        );
        adminSocketMap[userId] = (adminSocketMap[userId] || []).filter(
          (id) => id !== socket.id
        );

        if (
          (!userSocketMap[userId] || userSocketMap[userId].length === 0) &&
          (!adminSocketMap[userId] || adminSocketMap[userId].length === 0)
        ) {
          try {
            await User.findByIdAndUpdate(userId, { isOnline: false });
          } catch (error) {
            console.error("Error updating isOnline status:", error);
          }
        }
      }
      io.emit("getOnlineUsers", {
        users: Object.keys(userSocketMap),
        admin: Object.keys(adminSocketMap),
      });
    });
  });

  return io;
};

// Function lấy socket ID của một user/admin
const getReceiverSocketId = (receiverId) => {
  if (userSocketMap[receiverId] && userSocketMap[receiverId].length > 0) {
    return userSocketMap[receiverId][0];
  }
  if (adminSocketMap[receiverId] && adminSocketMap[receiverId].length > 0) {
    return adminSocketMap[receiverId][0];
  }
  return null;
};

module.exports = { setupSocket, getReceiverSocketId };
