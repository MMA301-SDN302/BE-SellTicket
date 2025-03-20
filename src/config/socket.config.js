const { Server } = require("socket.io");
const http = require("http");
const express = require("express");
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
  pingTimeout: 60000, // 1 minute timeout
  pingInterval: 25000, // 25 seconds ping interval
  reconnectionAttempts: 5, // Retry 5 times before giving up
  reconnectionDelay: 5000, 
});

const userSocketMap = {};

const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  const role = socket.handshake.query.role || "user";
  
  if (userId != "undefined") {
    const existingUser = userSocketMap[userId];
    console.log("User connected:", userId, "Role:", role);

    if (existingUser) {
      io.to(existingUser).emit("forceDisconnect");
      delete userSocketMap[userId];
    }
    userSocketMap[userId] = socket.id;
  }
  
  io.emit("getOnlineUsers", Object.keys(userSocketMap));
  
  socket.on("sendMessage", async ({ senderId, receiverId, content }) => {
    try {
      console.log("Message received:", { senderId, receiverId, content });
      
      const receiverSocketId = getReceiverSocketId(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receiveMessage", {
          senderId,
          receiverId,
          content,
          createdAt: new Date()
        });
      }
    } catch (error) {
      console.error("Error in sendMessage event:", error);
    }
  });
  
  socket.on("markMessageAsRead", ({ messageId, senderId }) => {
    try {
      const senderSocketId = getReceiverSocketId(senderId);
      if (senderSocketId) {
        io.to(senderSocketId).emit("messageRead", { messageId });
      }
    } catch (error) {
      console.error("Error marking message as read:", error);
    }
  });
  
  socket.on("disconnect", () => {
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

module.exports = { app, io, server, getReceiverSocketId };