const User = require("../models/Auth/User");
const Message = require("../models/Message/message");
const Conversation = require("../models/Message/conversation");
const { io } = require("../config/socket.config");
const mongoose = require("mongoose");

const userSocketMap = {};
const adminSocketMap = {};

// Function to get an admin user ID
const getAdminUserId = async () => {
  const admin = await User.findOne({ role: { $in: ["admin"] } });
  return admin ? admin._id : null;
};

const setupSocket = (messageService) => {
  io.on("connection", async (socket) => {
    const userId = socket.handshake.query.userId;
    const role = socket.handshake.query.role;

    console.log(`New socket connection - UserId: ${userId}, Role: ${role}`);

    if (userId && userId !== "undefined") {
      if (role === "admin") {
        adminSocketMap[userId] = socket.id;
        console.log('Admin socket mapped:', {userId, socketId: socket.id});
      } else {
        userSocketMap[userId] = socket.id;
        console.log('User socket mapped:', {userId, socketId: socket.id});
      }
    }

    socket.on("disconnect", () => {
      console.log(`Socket disconnected - UserId: ${userId}, Role: ${role}`);
      if (role === "admin") {
        delete adminSocketMap[userId];
      } else {
        delete userSocketMap[userId];
      }
    });

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
          receiverId: receiverId || "admin",
        });

        socket.emit("loadMessages", messages);
      } catch (error) {
        console.error("Error loading messages:", error);
        socket.emit("messageError", { error: error.message });
      }
    });

    socket.on("sendMessage", async (messageData) => {
      try {
        console.log("Message received:", messageData);

        // Đảm bảo messageData có đúng format
        const { senderId, receiverId, content } = messageData;

        // Gọi service để lưu và gửi tin nhắn
        const savedMessage = await messageService.sendMessage(
          senderId,
          receiverId,
          content
        );

        // Emit tin nhắn đến người nhận
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("newMessage", savedMessage);
        }
      } catch (error) {
        console.error("Error in sendMessage event:", error);
        socket.emit("messageError", {
          message: error.message,
        });
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
        console.log("Admin connected, fetching conversations for:", adminId);
        
        // Xác định nếu người dùng này thực sự là admin
        const adminUser = await User.findById(adminId);
        if (!adminUser || !adminUser.role || !adminUser.role.includes('admin')) {
          socket.emit("messageError", { error: "Unauthorized: Not an admin account" });
          return;
        }
        
        // Lấy tất cả conversations cho admin
        const conversations = await Conversation.find({
          participants: { $in: [adminId] }
        })
        .populate({
          path: 'participants',
          select: 'firstName lastName avatar isOnline role'
        })
        .populate({
          path: 'lastMessage',
          populate: {
            path: 'senderId receiverId',
            select: 'firstName lastName avatar'
          }
        })
        .sort({ updatedAt: -1 });

        // Tính toán số tin nhắn chưa đọc cho mỗi hội thoại
        const conversationsWithUnread = await Promise.all(
          conversations.map(async (conv) => {
            // Đếm số tin nhắn chưa đọc (gửi cho admin nhưng chưa đọc)
            const unreadCount = await Message.countDocuments({
              _id: { $in: conv.messages },
              receiverId: adminId,
              read: false
            });

            // Chuyển đổi thành đối tượng thuần túy để có thể thêm thuộc tính
            const convObj = conv.toObject();
            convObj.unreadCount = unreadCount;
            return convObj;
          })
        );

        socket.emit("adminConversations", conversationsWithUnread);
      } catch (error) {
        console.error("Error loading admin conversations:", error);
        socket.emit("messageError", { error: error.message });
      }
    });
  });

  return io;
};

// Function lấy socket ID của một user/admin
const getReceiverSocketId = (receiverId) => {
  console.log('Current socket maps:', {
    adminSockets: adminSocketMap,
    userSockets: userSocketMap
  });
  
  // Check admin sockets first
  const adminSocket = adminSocketMap[receiverId];
  if (adminSocket) return adminSocket;
  
  // Then check user sockets
  const userSocket = userSocketMap[receiverId];
  if (userSocket) return userSocket;
  
  console.log('No socket found for receiver:', receiverId);
  return null;
};

module.exports = { setupSocket, getReceiverSocketId };
