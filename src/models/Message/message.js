"use strict";

const { model, Schema, default: mongoose } = require("mongoose");
const DOCUMENT_NAME = "Message";
const COLLECTION_NAME = "Messages";
const messageSchema = new Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId | String,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);
module.exports = model(DOCUMENT_NAME, messageSchema);
