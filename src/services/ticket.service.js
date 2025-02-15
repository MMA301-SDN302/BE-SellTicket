const Ticket = require("../models/BusCompany/Ticket.js");
const ticketRepository = require("../repository/ticket.repo.js");

const getAllTickets = async () => {
  return await ticketRepository.getAllTickets();
};

const getTicketById = async (id) => {
  return await ticketRepository.getTicketById(id);
};

const createTicket = async (data) => {
  if (!data.trip_id) {
    throw new Error("Trip ID is required");
  }
  return await ticketRepository.createTicket(data);
};

const cancelTicket = async (id) => {
  return await ticketRepository.cancelTicket(id);
};

const autoCancelUnpaidTickets = async () => {
  return await ticketRepository.autoCancelUnpaidTickets();
};

const getSoldTicketsThisMonth = async () => {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const endOfMonth = new Date(startOfMonth);
  endOfMonth.setMonth(startOfMonth.getMonth() + 1);

  const soldTickets = await Ticket.countDocuments({
    ticket_status: "confirmed",
    createdAt: { $tge: startOfMonth, $lt: endOfMonth },
  });

  return soldTickets;
};
module.exports = {
  getAllTickets,
  getTicketById,
  createTicket,
  cancelTicket,
  autoCancelUnpaidTickets,
  getSoldTicketsThisMonth,
};
