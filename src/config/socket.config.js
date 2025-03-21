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
const adminSocketMap = {};

const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId] || adminSocketMap[receiverId];
};

// Function to broadcast online users to all connected clients
const getOnlineUsers = () => {
  console.log("Broadcasting online users to all clients");
  
  io.emit("getOnlineUsers", {
    users: Object.keys(userSocketMap),
    admin: Object.keys(adminSocketMap || {})
  });
  
  return {
    users: Object.keys(userSocketMap),
    admin: Object.keys(adminSocketMap || {})
  };
};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  const role = socket.handshake.query.role || "user";
  
  console.log(`New socket connection: ${socket.id} for user ${userId} with role ${role}`);
  
  if (userId && userId !== "undefined") {
    if (role === "admin") {
      // If this admin already has a socket connection, disconnect the old one
      const existingAdminSocket = adminSocketMap[userId];
      if (existingAdminSocket && existingAdminSocket !== socket.id) {
        console.log(`Admin ${userId} already has socket ${existingAdminSocket}, disconnecting old socket`);
        io.to(existingAdminSocket).emit("forceDisconnect");
        delete adminSocketMap[userId];
      }
      adminSocketMap[userId] = socket.id;
    } else {
      // If this user already has a socket connection, disconnect the old one
      const existingUserSocket = userSocketMap[userId];
      if (existingUserSocket && existingUserSocket !== socket.id) {
        console.log(`User ${userId} already has socket ${existingUserSocket}, disconnecting old socket`);
        io.to(existingUserSocket).emit("forceDisconnect");
        delete userSocketMap[userId];
      }
      userSocketMap[userId] = socket.id;
    }
    
    // Broadcast updated online users to all clients
    getOnlineUsers();
  }
  
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
    console.log(`Socket ${socket.id} disconnected for user ${userId} with role ${role}`);
    
    if (userId && userId !== "undefined") {
      if (role === "admin") {
        // Only delete if this socket ID matches the stored one
        if (adminSocketMap[userId] === socket.id) {
          delete adminSocketMap[userId];
        }
      } else {
        // Only delete if this socket ID matches the stored one
        if (userSocketMap[userId] === socket.id) {
          delete userSocketMap[userId];
        }
      }
      
      // Broadcast updated online users to all clients
      getOnlineUsers();
    }
  });
});

module.exports = { app, io, server, getReceiverSocketId, getOnlineUsers, userSocketMap, adminSocketMap };