const Message = require("../models/Message/message");
const Conversation = require("../models/Message/conversation");
const { BadRequestError } = require("../core/response/error.response");
const { ErrorCodes } = require("../core/errorConstant/httpStatusCode");
const User = require("../models/Auth/User");
const { getReceiverSocketId, io } = require("../config/socket.config");
const mongoose = require("mongoose");

const sendMessage = async (senderId, receiverId, content) => {
  try {
    console.log('Sending message:', {
      senderId,
      receiverId,
      content
    });

    // Kiểm tra thiếu dữ liệu
    if (!senderId || !receiverId || !content) {
      throw new BadRequestError(
        "Missing required fields: senderId, receiverId, content",
        ErrorCodes.MISSING_FIELD
      );
    }

    if (content.length > 500) {
      throw new BadRequestError("Message content is too long (max 500 chars)");
    }

    const filteredContent = content.replace(/badword/gi, "***");

    // Handle special case where receiverId is 'admin'
    let actualReceiverId = receiverId;
    if (receiverId === 'admin') {
      const admin = await User.findOne({ role: { $in: ['admin'] } });
      if (admin) {
        actualReceiverId = admin._id.toString();
        console.log("Resolved 'admin' to actual admin ID:", actualReceiverId);
      } else {
        throw new BadRequestError("No admin user found in the system");
      }
    }

    const sender = await User.findById(senderId);
    const receiver = await User.findById(actualReceiverId);

    if (!sender || !receiver) {
      throw new BadRequestError("Sender or Receiver does not exist");
    }

    // Kiểm tra xem cuộc trò chuyện đã tồn tại chưa
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, actualReceiverId] },
    });

    // Nếu chưa có, tạo cuộc trò chuyện mới
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, actualReceiverId],
      });
    }

    // Tạo tin nhắn mới
    const newMessage = await Message.create({
      senderId,
      receiverId: actualReceiverId,
      content: filteredContent,
    });

    // Cập nhật cuộc trò chuyện
    conversation.messages.push(newMessage._id);
    conversation.lastMessage = newMessage._id;
    await conversation.save();

    // Populate sender and receiver info for the frontend
    const populatedMessage = await Message.findById(newMessage._id)
      .populate('senderId', 'firstName lastName avatar isOnline')
      .populate('receiverId', 'firstName lastName avatar isOnline');

    // Gửi tin nhắn real-time nếu người nhận đang online
    const receiverSocketId = getReceiverSocketId(actualReceiverId);
    console.log('Receiver socket ID:', receiverSocketId);

    if (receiverSocketId) {
      console.log('Emitting message to socket:', receiverSocketId);
      io.to(receiverSocketId).emit("receiveMessage", populatedMessage);
    } else {
      console.log('No socket found for receiver:', actualReceiverId);
    }

    return populatedMessage;
  } catch (error) {
    console.error("Error in sendMessage:", error);
    throw error;
  }
};

// Add a function to handle loading message history
const getMessageHistory = async ({ senderId, receiverId }) => {
  try {
    // Handle special case where receiverId is 'admin'
    let actualReceiverId = receiverId;
    if (receiverId === 'admin') {
      const admin = await User.findOne({ role: { $in: ['admin'] } });
      if (admin) {
        actualReceiverId = admin._id.toString();
      } else {
        throw new BadRequestError("No admin user found in the system");
      }
    }

    // Find conversation between these users
    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, actualReceiverId] },
    });

    if (!conversation) {
      return [];
    }

    // Get messages with populated user info
    const messages = await Message.find({
      _id: { $in: conversation.messages }
    })
    .populate('senderId', 'firstName lastName avatar isOnline')
    .populate('receiverId', 'firstName lastName avatar isOnline')
    .sort({ createdAt: 1 });

    return messages;
  } catch (error) {
    console.error("Error in getMessageHistory:", error);
    throw error;
  }
};

const createDefaultConversation = async (userId) => {
  try {
    // Kiểm tra nếu user đã có cuộc trò chuyện chưa
    const existingConversation = await Conversation.findOne({
      participants: { $in: [userId] },
    });

    if (!existingConversation) {
      // Find an admin to create conversation with
      const admin = await User.findOne({ role: { $in: ['admin'] } });
      if (!admin) {
        throw new BadRequestError("No admin user found in the system");
      }

      const newConversation = await Conversation.create({
        participants: [userId, admin._id],
      });

      // Tạo tin nhắn mặc định từ admin
      const newMessage = await Message.create({
        senderId: admin._id,
        receiverId: userId,
        content: "Xin chào, tôi có thể giúp gì cho bạn?",
      });

      newConversation.messages.push(newMessage._id);
      newConversation.lastMessage = newMessage._id;
      await newConversation.save();

      // Lấy socketId của user để gửi real-time
      const userSocketId = getReceiverSocketId(userId);
      if (userSocketId) {
        const populatedMessage = await Message.findById(newMessage._id)
          .populate('senderId', 'firstName lastName avatar isOnline')
          .populate('receiverId', 'firstName lastName avatar isOnline');
          
        io.to(userSocketId).emit("receiveMessage", populatedMessage);
      }
      
      return newMessage;
    }
    
    return null;
  } catch (error) {
    console.error("Error in createDefaultConversation:", error);
    throw error;
  }
};

const getMessages = async (senderId, receiverId) => {
  // Get conversation between sender and receiver
  const conversation = await Conversation.findOne({
    participants: { $all: [senderId, receiverId] },
  }).populate({
    path: 'messages',
    populate: {
      path: 'senderId receiverId',
      select: 'firstName lastName avatar isOnline'
    }
  });

  if (!conversation) {
    return [];
  }

  return conversation.messages;
};

const markMessageAsRead = async (messageId) => {
  const message = await Message.findById(messageId);
  
  if (!message) {
    throw new BadRequestError("Message not found");
  }

  message.read = true;
  await message.save();

  return message;
};

const getUserConversations = async (userId) => {
  try {
    console.log('Fetching conversations for userId:', userId);
    
    // Validate userId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.error(`Invalid userId format: ${userId}`);
      throw new BadRequestError("Invalid user ID format");
    }
    
    const conversations = await Conversation.find({
      participants: userId
    }).populate({
      path: 'participants',
      select: 'firstName lastName avatar isOnline'
    }).populate({
      path: 'lastMessage',
      select: 'content createdAt read senderId receiverId'
    }).sort({ updatedAt: -1 });
    
    console.log(`Found ${conversations.length} conversations for userId: ${userId}`);
    return conversations;
  } catch (error) {
    console.error('Error in getUserConversations:', error);
    throw error;
  }
};

const getAdminConversations = async (adminId) => {
  try {
    // Xác thực adminId
    if (!adminId) {
      throw new BadRequestError("Admin ID is required");
    }

    // Lấy tất cả các cuộc hội thoại có admin tham gia
    const conversations = await Conversation.find({
      participants: { $in: [adminId] }
    })
    .populate({
      path: 'participants',
      select: 'firstName lastName avatar isOnline role phoneNumber'
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

        // Lấy người dùng không phải admin trong hội thoại để làm đối tượng chat
        const otherParticipant = convObj.participants.find(
          p => p._id.toString() !== adminId.toString()
        );
        
        convObj.chatUser = otherParticipant || null;
        
        return convObj;
      })
    );

    return conversationsWithUnread;
  } catch (error) {
    throw error;
  }
};

module.exports = { 
  sendMessage, 
  createDefaultConversation, 
  getMessages, 
  markMessageAsRead,
  getUserConversations,
  getMessageHistory,
  getAdminConversations
};
