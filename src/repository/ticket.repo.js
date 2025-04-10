const { NotFoundError } = require("../core/response/error.response");
const Ticket = require("../models/BusCompany/Ticket");
const Trip = require("../models/BusCompany/Trip");

const getAllTickets = async () => {
  return await Ticket.find().populate("route_id");
};

const getTicketById = async (_id) => {
  return await Ticket.findOne({ _id }).populate("_id");
};

const createTicket = async (data) => {
  const trip = await Trip.findById(data.trip_id);
  if (!trip)
    throw new NotFoundError("Không tìm thấy tuyến");
  if (trip.availableSeats <= 0) throw new NotFoundError("No available seats");

  trip.availableSeats -= 1;
  await trip.save();

  const ticket = await Ticket.create(data);
  return ticket;
};
const createManyTickets = async (ticketsData) => {
  return await Ticket.insertMany(ticketsData); // Chèn nhiều vé một lần
};

const cancelTicket = async (id) => {
  console.log("Hủy vé với TicketId:", id);

  const ticket = await Ticket.findById(id);
  if (!ticket) throw new NotFoundError("Ticket not found");

  const trip = await Trip.findById(ticket.trip_id);
  if (trip) {
    trip.availableSeats += 1;
    await trip.save();
  }

  ticket.ticket_status = "cancelled";
  await ticket.save();

  return ticket;
};



// Tự động hủy vé chưa thanh toán sau 15 phút
const autoCancelUnpaidTickets = async () => {
  const expirationTime = new Date();
  expirationTime.setMinutes(expirationTime.getMinutes() - 15);

  const ticketsToCancel = await Ticket.find({
    ticket_status: "pending",
    createdAt: { $lt: expirationTime }
  });

  for (let ticket of ticketsToCancel) {
    await cancelTicket(ticket._id);
  }
};

<<<<<<< HEAD
const getTicketsByRoute = async (routeId) => {
  return await Ticket.find({ route_id: routeId }).lean();
};

const getLastTicketNo = async () => {
  const lastTicket = await Ticket.findOne().sort({ ticket_No: -1 }).lean();
  return lastTicket ? parseInt(lastTicket.ticket_No, 10) : 100000;
};

=======
>>>>>>> origin/develop
module.exports = {
  getAllTickets,
  getTicketById,
  createTicket,
  cancelTicket,
<<<<<<< HEAD
  autoCancelUnpaidTickets,
  getTicketsByRoute,
  createManyTickets,
  getLastTicketNo,
=======
  autoCancelUnpaidTickets
>>>>>>> origin/develop
};