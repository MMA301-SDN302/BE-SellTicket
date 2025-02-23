const routeRepository = require("../repository/route.repo");

const getAllRoutes = async () => {
  return await routeRepository.getAllRoutes();
};

const getRouteById = async (id) => {
  return await routeRepository.getRouteById(id);
};

const createRoute = async (data) => {
  if (!data.startLocation || !data.endLocation || !data.car) {
    throw new Error("Start location, end location, and car are required");
  }
  return await routeRepository.createRoute(data);
};

const updateRoute = async (id, data) => {
  return await routeRepository.updateRoute(id, data);
};

const deleteRoute = async (id) => {
  return await routeRepository.deleteRoute(id);
};

const getCarByRoute = async (startLocation, endLocation) => {
  return await routeRepository.getCarsByRoute(startLocation, endLocation);
};

module.exports = {
  getAllRoutes,
  getRouteById,
  createRoute,
  updateRoute,
  deleteRoute,
  getCarByRoute,
};
