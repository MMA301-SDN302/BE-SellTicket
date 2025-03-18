const Route = require("../models/BusCompany/Route");
const Location = require("../models/BusCompany/Location");
const Car = require("../models/BusCompany/Car");

const getAllRoutes = async () => {
  return await Route.find()
    .populate("car")
    .populate("startLocation")
    .populate("endLocation");
};

const getRouteById = async (_id) => {
  return await Route.findOne({ _id })
    .populate("car")
    .populate("startLocation")
    .populate("endLocation");
};

const createRoute = async (data) => {
  return await Route.create(data);
};

const updateRoute = async (_id, data) => {
  return await Route.findOneAndUpdate({ _id }, data, { new: true });
};

const deleteRoute = async (_id) => {
  return await Route.findOneAndDelete({ _id });
};

const getRouteBySearch = async (startDate, endDate) => {
  return await Route.find({
    routeStartTime: { $gte: startDate, $lte: endDate },
  })
    .populate({ path: "car", populate: { path: "buscompany_id", model: "BusCompany" } })
    .populate("trip");
};

module.exports = {
  getAllRoutes,
  getRouteById,
  createRoute,
  updateRoute,
  deleteRoute,
  getRouteBySearch,
};
