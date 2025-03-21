const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema(
  {
    ticket_id: {
      type: String,
      required: true,
      unique: true,
      default: () => new mongoose.Types.ObjectId().toString(),
    },
    ticket_No: {
      type: String,
      required: true,
      unique: true,
    },
    passenger: { type: String, required: true },

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
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },
    route_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Route",
      required: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    startlocation: {
      type: String,
      default: null,
    },
    endlocation: {
      type: String,
      default: null,
    }

  },
  {
    collection: "Ticket",
    timestamps: true,
  }
);

const Ticket = mongoose.model("Ticket", ticketSchema);

module.exports = Ticket;
