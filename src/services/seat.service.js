const Seat = require("../models/BusCompany/Seat.js");
const BusRoute = require("../models/BusCompany/Route.js");
const { BadRequestError, InternalServerError } = require("../core/response/error.response.js");
const reposTicket = require("../repository/ticket.repo.js");

const getSeatsByRoute = async (routeId, startLocationName, endLocationName) => {
  try {
    const route = await BusRoute.findById(routeId).populate("trip");
    if (!route || !route.car) {
      throw new BadRequestError("Không tìm thấy thông tin xe cho tuyến này.");
    }

    const startStopIndex = route.stopMap.findIndex(stop => stop.name === startLocationName);
    const endStopIndex = route.stopMap.findIndex(stop => stop.name === endLocationName);

    if (startStopIndex === -1 || endStopIndex === -1) {
      throw new BadRequestError("Không tìm thấy điểm dừng phù hợp.");
    }

    if (startStopIndex >= endStopIndex) {
      throw new BadRequestError("Điểm đến phải sau điểm xuất phát.");
    }

    const seats = await Seat.find({ route: routeId }).lean();
    if (!seats.length) {
      throw new BadRequestError("Không tìm thấy ghế nào trên xe này.");
    }

    const bookedTickets = await reposTicket.getTicketsByRoute(routeId);

    const updatedSeats = seats.map(seat => {
      const bookedTicket = bookedTickets.find(ticket => {
        if (ticket.ticket_seat !== seat.seatNumber) return false;

        const ticketStartIndex = route.stopMap.findIndex(stop => stop.name === ticket.startlocation);
        const ticketEndIndex = route.stopMap.findIndex(stop => stop.name === ticket.endlocation);

        if (ticketStartIndex === -1 || ticketEndIndex === -1) return false;

        return ticketStartIndex < endStopIndex && ticketEndIndex > startStopIndex;
      });

      return {
        id: seat._id.toString(),
        seatNumber: seat.seatNumber,
        isAvailable: !bookedTicket,
        ticket_status: bookedTicket ? bookedTicket.ticket_status : "available",
        floor: seat.floor || 1,
      };
    });

    const seatMap = {
      floor1: updatedSeats.filter(seat => seat.floor === 1),
      floor2: updatedSeats.filter(seat => seat.floor === 2),
    };

    return {
      route: route.toObject(),
      seatMap,
    };
  } catch (error) {
    console.error("Lỗi khi lấy danh sách ghế:", error.message);

    if (error instanceof BadRequestError) {
      throw error;
    }

    throw new InternalServerError("Có lỗi xảy ra khi lấy danh sách ghế.");
  }
};

const getSeatStatus = async (routeId, seatId) => {
  try {
    const route = await BusRoute.findById(routeId).populate("trip");
    if (!route || !route.car) {
      throw new BadRequestError("Không tìm thấy thông tin xe cho tuyến này.");
    }

    const seat = await Seat.findOne({ _id: seatId, route: routeId }).lean();
    if (!seat) {
      throw new BadRequestError("Không tìm thấy thông tin ghế này.");
    }

    const bookedTickets = await reposTicket.getTicketsByRoute(routeId);

    const bookedTicket = bookedTickets.find(ticket => {
      if (ticket.ticket_seat !== seat.seatNumber) return false;

      const ticketStartIndex = route.stopMap.findIndex(stop => stop.name === ticket.startlocation);
      const ticketEndIndex = route.stopMap.findIndex(stop => stop.name === ticket.endlocation);

      if (ticketStartIndex === -1 || ticketEndIndex === -1) return false;

      return ticketStartIndex < route.stopMap.length && ticketEndIndex > 0;
    });

    return {
      seat: {
        id: seat._id.toString(),
        seatNumber: seat.seatNumber,
        isAvailable: !bookedTicket,
        ticket_status: bookedTicket ? bookedTicket.ticket_status : "available",
        floor: seat.floor || 1,
      },
    };
  } catch (error) {
    console.error("Lỗi khi lấy trạng thái ghế:", error.message);

    if (error instanceof BadRequestError) {
      throw error;
    }

    throw new InternalServerError("Có lỗi xảy ra khi lấy trạng thái ghế.");
  }
};

const createTicket = async (routeId, seatIds, userId, from, to, price) => {
  try {
    const route = await BusRoute.findById(routeId).populate("trip");
    if (!route || !route.car) {
      throw new BadRequestError("Không tìm thấy thông tin xe cho tuyến này.");
    }

    const seats = await Seat.find({ _id: { $in: seatIds }, route: routeId }).lean();
    if (!seats.length) {
      throw new BadRequestError("Không tìm thấy thông tin ghế.");
    }

    const bookedTickets = await reposTicket.getTicketsByRoute(routeId);
    const unavailableSeats = seatIds.filter(seatId => 
      bookedTickets.some(ticket => ticket.ticket_seat === seats.find(s => s._id.toString() === seatId)?.seatNumber)
    );

    if (unavailableSeats.length) {
      throw new BadRequestError(`Ghế sau đã được đặt: ${unavailableSeats.join(", ")}`);
    }

    let lastTicketNo = (await reposTicket.getLastTicketNo()) || 1000;

    const ticketsData = seatIds.map((seatId, index) => {
      const seat = seats.find(s => s._id.toString() === seatId) || {};
      return {
        ticket_No: (lastTicketNo + index + 1).toString(),
        route_id: routeId,
        seat_id: seatId,
        user_id: userId,
        startlocation: from || "Unknown Start Location",
        endlocation: to || "Unknown End Location",
        ticket_price: price || 0,
        passenger: "passenger",
        ticket_status: "pending",
        ticket_seat: seat.seatNumber || "Unknown Seat",
      };
    });

    const tickets = await reposTicket.createManyTickets(ticketsData);

    return { tickets };
  } catch (error) {
    console.error("Lỗi khi tạo vé:", error.message);
    throw error instanceof BadRequestError ? error : new InternalServerError("Có lỗi xảy ra khi tạo vé.");
  }
};

module.exports = {
  getSeatsByRoute,
  getSeatStatus,
  createTicket,
};
