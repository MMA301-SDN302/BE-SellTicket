const Seat = require("../models/BusCompany/Seat.js");
const Ticket = require("../models/BusCompany/Ticket.js");
const StopMap = require("../models/BusCompany/StopMap.js");

const getSeatByRoute = async (routeId, startLocationName, endLocationName) => {
  try {
    const seats = await Seat.find({ route: routeId });

    const bookedTickets = await Ticket.find({ trip_id: routeId });

    const stopMap = await StopMap.findOne();
    if (!stopMap) throw new Error("Không tìm thấy dữ liệu điểm dừng.");

    const userStartStop = stopMap.stops.find(
      (stop) => stop.stop_name === startLocationName
    );
    const userEndStop = stopMap.stops.find(
      (stop) => stop.stop_name === endLocationName
    );

    if (!userStartStop || !userEndStop) {
      throw new Error("Không tìm thấy điểm dừng phù hợp.");
    }

    const userStartId = userStartStop.stop_id;
    const userEndId = userEndStop.stop_id;

    const userDirection = userStartId < userEndId ? "NORTHBOUND" : "SOUTHBOUND";

    const updatedSeats = seats.map((seat) => {
      const isBooked = bookedTickets.some((ticket) => {
        const ticketStartStop = stopMap.stops.find(
          (stop) => stop.stop_name === ticket.depature
        );
        const ticketEndStop = stopMap.stops.find(
          (stop) => stop.stop_name === ticket.arrive
        );

        if (!ticketStartStop || !ticketEndStop) return false;

        const ticketStartId = ticketStartStop.stop_id;
        const ticketEndId = ticketEndStop.stop_id;

        const ticketDirection =
          ticketStartId < ticketEndId ? "NORTHBOUND" : "SOUTHBOUND";

        if (userDirection !== ticketDirection) return false;

        return (
          (ticketStartId >= userStartId && ticketStartId < userEndId) ||
          (ticketEndId > userStartId && ticketEndId <= userEndId)
        );
      });

      return {
        ...seat.toObject(),
        isAvailable: isBooked ? false : seat.isAvailable,
      };
    });

    return updatedSeats;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách ghế:", error.message);
    throw error;
  }
};

module.exports = {
  getSeatByRoute,
};
