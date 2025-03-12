const { ErrorCodes } = require("../core/errorConstant/httpStatusCode");
const { BadRequestError } = require("../core/response/error.response");
const conversation = require("../models/Message/conversation");
const { isMissingObjectData } = require("../utils");
const sendMessage = async ({
  message,
  senderId,
  receiverId,
  traceId,
}) => {
  const isValid = await isMissingObjectData({
    message,
    senderId,
    receiverId,
  });
  if (isValid) {
    throw new BadRequestError(`Missing ${isValid}`, ErrorCodes.MISSING_FIELD);
  }
  if (senderType === "user") {
    const conversation = await conversation.findOne({
      participants: {
        $all: [senderId],
      },
    });
    // TH1 : user gửi tin nhắn lần dầu 
    // if (!conversation) {
    //   throw new BadRequestError("Conversation not found", ErrorCodes.NOT_FOUND);
    // }
    // const newMessage = await message.create({
    //   senderId,
    //   receiverId,
    //   content: message,
    // });
    // conversation.messages.push(newMessage);
    // conversation.lastMessage = newMessage._id;
    // await conversation.save();
  }
};

const createDefaultConversation = async (userId) => {
  const newConversation = await conversation.create({
    participants: [userId],
  });
  const newMessage = await message.create({
    senderId: "system",
    receiverId: userId,
    content: "Xin chào, tôi có thể giúp gì cho bạn?",
  });
  newConversation.messages.push(newMessage);
  newConversation.lastMessage = newMessage._id;
  await newConversation.save();
};

module.exports = { sendMessage, createDefaultConversation };
