import * as service from "../services/ticket.service.js";
import { OK, CREATED } from "../core/response/success.response.js";
import {
  NotFoundError,
  BadRequestError,
} from "../core/response/error.response.js";

export const getAllTickets = async (req, res) => {
  const tickets = await service.getAllTickets();
  return new OK({
    message: "Tickets retrieved successfully",
    metadata: tickets,
  }).send(res);
};

export const getTicketById = async (req, res) => {
  const ticket = await service.getTicketById(req.params.id);
  if (!ticket) {
    throw new NotFoundError("Ticket not found");
  }
  return new OK({
    message: "Ticket retrieved successfully",
    metadata: ticket,
  }).send(res);
};

export const createTicket = async (req, res) => {
  if (!req.body.trip_id) throw new BadRequestError("Trip ID is required");

  const newTicket = await service.createTicket(req.body);
  return new CREATED({
    message: "Ticket created successfully",
    metadata: newTicket,
  }).send(res);
};

export const cancelTicket = async (req, res) => {
  const cancelled = await service.cancelTicket(req.params.id);
  return new OK({
    message: "Ticket cancelled successfully",
    metadata: cancelled,
  }).send(res);
};

export const getSoldTicketsThisMonth = async (req, res) => {
  const soldTickets = await service.getSoldTicketsThisMonth();
  return OK({
    message: "Sold tickets for this month retrieved successfully",
    metadata: { soldTickets },
  }).send(res);
};
