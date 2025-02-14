const Ticket = require("../models/BusCompany/Ticket");
const Trip = require("../models/BusCompany/Trip");

const getAllTickets = async () => {
  return await Ticket.find().populate("trip_id");
};

const getTicketById = async (id) => {
  return await Ticket.findOne({ _id: id }).populate("trip_id");
};

const createTicket = async (data) => {
  const trip = await Trip.findById(data.trip_id);
  if (!trip) throw new Error("Trip not found");

  if (trip.availableSeats <= 0) throw new Error("No available seats");

  trip.availableSeats -= 1;
  await trip.save();

  const ticket = await Ticket.create(data);
  return ticket;
};

const cancelTicket = async (id) => {
    // Lấy thông tin vé
    const ticket = await Ticket.findById(id);
    if (!ticket) throw new Error("Ticket not found");

    // Tăng lại số ghế trống cho chuyến đi
    const trip = await Trip.findById(ticket.trip_id);
    if (trip) {
        trip.availableSeats += 1;
        await trip.save();
    }

    // Xóa vé
    await Ticket.findByIdAndDelete(id);
    return { message: "Ticket cancelled successfully" };
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

module.exports = {
    getAllTickets,
    getTicketById,
    createTicket,
    cancelTicket,
    autoCancelUnpaidTickets
};