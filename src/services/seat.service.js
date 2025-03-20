const Seat = require("../models/BusCompany/Seat.js");
const Ticket = require("../models/BusCompany/Ticket.js");
const BusRoute = require("../models/BusCompany/Route.js");
const CarModel = require("../models/BusCompany/Car.js");
const { BadRequestError, InternalServerError } = require("../core/response/error.response.js");

const getSeatsByRoute = async (routeId, startLocationName, endLocationName) => {
  try {
    const route = await BusRoute.findById(routeId).populate("trip");
    if (!route || !route.car) {
      throw new BadRequestError("Không tìm thấy thông tin xe cho tuyến này.");
    }

    const startStop = route.stopMap.find(stop => stop.name === startLocationName);
    const endStop = route.stopMap.find(stop => stop.name === endLocationName);

    if (!startStop || !endStop) {
      throw new BadRequestError("Không tìm thấy điểm dừng phù hợp.");
    }

    if (route.stopMap.indexOf(startStop) >= route.stopMap.indexOf(endStop)) {
      throw new BadRequestError("Điểm đến phải sau điểm xuất phát.");
    }

    const totalStops = route.stopMap.length - 1;
    const distanceRatio = Math.abs(route.stopMap.indexOf(endStop) - route.stopMap.indexOf(startStop)) / totalStops;
    const pricePart = Math.round(route.trip.price * distanceRatio);

    const seats = await Seat.find({ route: routeId }).lean();
    console.log("Total seats on the bus:", seats.length);

    if (!seats.length) {
      throw new BadRequestError("Không tìm thấy ghế nào trên xe này.");
    }

    const bookedTickets = await Ticket.find({ trip_id: routeId }).lean();
    console.log("Total booked tickets:", bookedTickets.length);

    const updatedSeats = seats.map(seat => {
      const isBooked = bookedTickets.some(ticket => {
        const ticketStartStop = route.stopMap.find(stop => stop.name === ticket.depature);
        const ticketEndStop = route.stopMap.find(stop => stop.name === ticket.arrive);

        if (!ticketStartStop || !ticketEndStop) return false;

        return (
          route.stopMap.indexOf(ticketStartStop) < route.stopMap.indexOf(endStop) &&
          route.stopMap.indexOf(ticketEndStop) > route.stopMap.indexOf(startStop)
        );
      });

      return {
        id: seat._id.toString(),
        seatNumber: seat.seatNumber,
        isAvailable: !isBooked,
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


module.exports = { 
  getSeatsByRoute,
};
