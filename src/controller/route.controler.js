const service = require("../services/route.service.js");
const { OK, CREATED } = require("../core/response/success.response.js");
const {
  NotFoundError,
  BadRequestError,
  InternalServerError,
 } = require("../core/response/error.response.js");

const getAllRoutes = async (req, res) => {
  const routes = await service.getAllRoutes();
  return new OK({
    message: "Routes retrieved successfully",
    metadata: routes,
  }).send(req, res);
};

const getRouteById = async (req, res) => {
  const route = await service.getRouteById(req.params._id);
  if (!route) {
    throw new NotFoundError("Route not found");
  }
  return new OK({
    message: "Route retrieved successfully",
    metadata: route,
  }).send(req, res);
};

const createRoute = async (req, res) => {
  if (!req.body.startLocation || !req.body.endLocation) {
    throw new BadRequestError("Start and End locations are required");
  }

  const newRoute = await service.createRoute(req.body);
  return new CREATED({
    message: "Route created successfully",
    metadata: newRoute,
  }).send(req, res);
};

const updateRoute = async (req, res) => {
  const updatedRoute = await service.updateRoute(req.params._id, req.body);
  if (!updatedRoute) throw new NotFoundError("Route not found");

  return new OK({
    message: "Route updated successfully",
    metadata: updatedRoute,
  }).send(req, res);
};

const deleteRoute = async (req, res) => {
  const deletedRoute = await service.deleteRoute(req.params._id);
  if (!deletedRoute) throw new NotFoundError("Route not found");

  return new OK({ message: "Route deleted successfully" }).send(req, res);
};

const getSearchRoutes = async (req, res) => {
  try {
    const startLocation = decodeURIComponent(req.query.startLocation);
    const endLocation = decodeURIComponent(req.query.endLocation);
    const date = decodeURIComponent(req.query.date);
    const cars = await service.getCarByRoute(startLocation, endLocation, date);

    return new OK({ message: "Route search result OK", metadata: cars }).send(req, res);
  } catch (error) {
    console.error("getSearchRoutes error:", error);

    if (error instanceof BadRequestError) {
      return error.send(req, res);
    }

    return res.status(500).json({
      status: "error",
      code: 500,
      message: "Internal Server Error",
    });
  }
};

const getLocationName = async (req, res) => {
  try {
    const startLocation = decodeURIComponent(req.query.startLocation);
    const endLocation = decodeURIComponent(req.query.endLocation);
    const date = decodeURIComponent(req.query.date);
    const cars = await service.getStopMap(startLocation, endLocation, date);

    return new OK({ message: "Route search result OK", metadata: cars }).send(req, res);
  } catch (error) {
    console.error("getSearchRoutes error:", error);

    if (error instanceof BadRequestError) {
      return error.send(req, res);
    }

    return res.status(500).json({
      status: "error",
      code: 500,
      message: "Internal Server Error",
    });
  }
};


module.exports = {
  getAllRoutes,
  getRouteById,
  createRoute,
  updateRoute,
  deleteRoute,
  getSearchRoutes,
  getLocationName,
};
