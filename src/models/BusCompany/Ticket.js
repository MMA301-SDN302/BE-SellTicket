const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema(
  {
    
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
    route_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Route",
      required: true, 
    },
  },
  {
    collection: "Ticket",
    timestamps: true, 
  }
);

const Ticket = mongoose.model("Ticket", ticketSchema);

module.exports = Ticket;
