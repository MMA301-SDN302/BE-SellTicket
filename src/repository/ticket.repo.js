const Ticket = require("../models/BusCompany/Ticket");
const Trip = require("../models/BusCompany/Trip");

const getAllTickets = async () => {
  return await Ticket.find().populate("_id");
};

const getTicketById = async (_id) => {
  return await Ticket.findOne({ _id }).populate("_id");
};

const createTicket = async (data) => {
  const trip = await Trip.findById(data._id);
  if (!trip) throw new Error("Trip not found");

  if (trip.availableSeats <= 0) throw new Error("No available seats");

  trip.availableSeats -= 1;
  await trip.save();

  const ticket = await Ticket.create(data);
  return ticket;
};
const createManyTickets = async (ticketsData) => {
  return await Ticket.insertMany(ticketsData); // Chèn nhiều vé một lần
};

const cancelTicket = async (_id) => {
    // Lấy thông tin vé
    const ticket = await Ticket.findById(_id);
    if (!ticket) throw new Error("Ticket not found");

    // Tăng lại số ghế trống cho chuyến đi
    const trip = await Trip.findById(ticket._id);
    if (trip) {
        trip.availableSeats += 1;
        await trip.save();
    }

    // Xóa vé
    await Ticket.findByIdAndDelete(_id);
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
    autoCancelUnpaidTickets,
    createManyTickets
};