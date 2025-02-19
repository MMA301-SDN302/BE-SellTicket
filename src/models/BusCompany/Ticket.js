const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema(
  {
    ticket_id: {
      type: Number,
      required: true,
      unique: true,
    },
    ticket_price: {
      type: Number,
      required: true,
    },
    ticket_seat: {
      type: String,
      default: null,
    },
    ticket_status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
    trip_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trip",
      required: true, 
    },
  },
  {
    collection: "ticket",
    timestamps: true, 
  }
);

const Ticket = mongoose.model("Ticket", ticketSchema);

module.exports = Ticket;
