const service = require("../services/ticket.service.js");
const { OK, CREATED } = require("../core/response/success.response.js");
const {
  NotFoundError,
  BadRequestError,
} = require("../core/response/error.response.js");

const getAllTickets = async (req, res, next) => {
  const tickets = await service.getAllTickets();
  if (!tickets) {
    return res.status(404).json({ status: "error", code: 404, message: "No tickets found" });
  }

  return new OK({
    message: "Routes retrieved successfully",
    metadata: tickets || [],
  }).send(req, res);

};


const getTicketById = async (req, res) => {

  const ticket = await service.getTicketById(req.params._id);
  if (!ticket) {
    throw new NotFoundError("Ticket not found");
  }

  return new OK({
    message: "Ticket retrieved successfully",
    metadata: ticket,
  }).send(req, res);
};

const createTicket = async (req, res) => {
  if (!req.body.trip_id) throw new BadRequestError("Trip ID is required");

  const newTicket = await service.createTicket(req.body);
  return new CREATED({
    message: "Ticket created successfully",
    metadata: newTicket,
  }).send(req, res);
};

const cancelTicket = async (req, res) => {
  const cancelled = await service.cancelTicket(req.params._id);
  return new OK({
    message: "Ticket cancelled successfully",
    metadata: cancelled,
  }).send(req, res);
};

const getSoldTicketsThisMonth = async (req, res) => {
  const soldTickets = await service.getSoldTicketsThisMonth();
  return OK({
    message: "Sold tickets for this month retrieved successfully",
    metadata: { soldTickets },
  }).send(req, res);
};

module.exports = {
  getAllTickets,
  getTicketById,
  createTicket,
  cancelTicket,
  getSoldTicketsThisMonth,
};
