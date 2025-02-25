const Route = require("../models/BusCompany/Route");
const Location = require("../models/BusCompany/Location")
const Car = require("../models/BusCompany/Car")
const getAllRoutes = async () => {
  return await Route.find()
    .populate("busCompany")
    .populate("car")
    .populate("startLocation")
    .populate("endLocation");
};

const getRouteById = async (id) => {
  return await Route.findOne({ _id: id })
    .populate("busCompany")
    .populate("car")
    .populate("startLocation")
    .populate("endLocation");
};

const createRoute = async (data) => {
  return await Route.create(data);
};

const updateRoute = async (id, data) => {
  return await Route.findOneAndUpdate({ _id: id }, data, { new: true });
};

const deleteRoute = async (id) => {
  return await Route.findOneAndDelete({ _id: id });
};

module.exports = {
  getAllRoutes,
  getRouteById,
  createRoute,
  updateRoute,
  deleteRoute,
};
