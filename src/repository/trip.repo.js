const Trip = require("../models/BusCompany/Trip.js");
const createTrip = async (data) => {
  return await Trip.create(data);
};

const getTripsByRoute = async (routeId) => {
  return await Trip.find({ route: routeId }).populate("car busCompany");
};

const getTripById = async (id) => {
  console.log("check");

  return await Trip.findOne({ _id: id }).populate("car busCompany");
};

const deleteTripsByRoute = async (routeId) => {
  try {
    console.log("Received routeId:", routeId);
    const result = await Trip.findByIdAndDelete(routeId);
    console.log("Delete result:", result);
    return result;
  } catch (error) {
    console.error("Error deleting trip:", error.message);
    throw new Error("Failed to delete trip. Please check input data.");
  }
};

const getTrips = async () => {
  return await Trip.find().populate("car").lean();
};
module.exports = {
  deleteTripsByRoute,
  getTripById,
  getTripsByRoute,
  createTrip,
  getTrips,
};
