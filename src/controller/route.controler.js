import * as service from "../services/route.service.js";
import { OK, CREATED } from "../core/response/success.response.js";
import { NotFoundError, BadRequestError } from "../core/response/error.response.js";

export const getAllRoutes = async (req, res) => {
  const routes = await service.getAllRoutes();
  return new OK({
    message: "Routes retrieved successfully",
    metadata: routes,
  }).send(res);
};

export const getRouteById = async (req, res) => {
  const route = await service.getRouteById(req.params.id);
  if (!route) {
    throw new NotFoundError("Route not found");
  }
  return new OK({
    message: "Route retrieved successfully",
    metadata: route,
  }).send(res);
};

export const createRoute = async (req, res) => {
  if (!req.body.startLocation || !req.body.endLocation) {
    throw new BadRequestError("Start and End locations are required");
  }

  const newRoute = await service.createRoute(req.body);
  return new CREATED({
    message: "Route created successfully",
    metadata: newRoute,
  }).send(res);
};

export const updateRoute = async (req, res) => {
  const updatedRoute = await service.updateRoute(req.params.id, req.body);
  if (!updatedRoute) throw new NotFoundError("Route not found");

  return new OK({
    message: "Route updated successfully",
    metadata: updatedRoute,
  }).send(res);
};

export const deleteRoute = async (req, res) => {
  const deletedRoute = await service.deleteRoute(req.params.id);
  if (!deletedRoute) throw new NotFoundError("Route not found");

  return new OK({ message: "Route deleted successfully" }).send(res);
};


export const getSearchRoutes = async (req, res) => {
  try {
    const startLocation = decodeURIComponent(req.query.startLocation);
    const endLocation = decodeURIComponent(req.query.endLocation);
    const date = decodeURIComponent(req.query.date);
    const cars = await service.getCarByRoute(startLocation, endLocation, date);
    return res.status(200).json({ status: "success", data: cars });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      code: 500,
      message: error.message,
    });
  }
};