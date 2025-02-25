const Seat = require("../models/BusCompany/Seat");
const createSeats = async (seatsData) => {
  return await Seat.insertMany(seatsData); // Chèn nhiều ghế một lần
};

module.exports = {
  createSeats,
};
