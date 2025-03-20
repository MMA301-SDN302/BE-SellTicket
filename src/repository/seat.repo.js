const Seat = require("../models/BusCompany/Seat");

const getAllSeats = async () => {
  return await Seat.find().populate("route");
};

const getSeatById = async (_id) => {
  return await Seat.findOne({ _id }).populate("route");
};

const createSeat = async (data) => {
  return await Seat.create(data);
};

const updateSeat = async (_id, data) => {
  return await Seat.findOneAndUpdate({ _id }, data, { new: true }).populate("route");
};

const deleteSeat = async (_id) => {
  return await Seat.findOneAndDelete({ _id });
};

const getAvailableSeats = async (routeId) => {
  return await Seat.find({
    route: routeId,
    isAvailable: true,
  });
};

module.exports = {
  getAllSeats,
  getSeatById,
  createSeat,
  updateSeat,
  deleteSeat,
  getAvailableSeats,
};
