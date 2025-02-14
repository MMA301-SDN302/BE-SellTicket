const routeRepository = require("../repository/route.repo.js")



const getAllRoutes = async () => {
  return await routeRepository.getAllRoutes();
};

const getRouteById = async (id) => {
  return await routeRepository.getRouteById(id);
};

const createRoute = async (data) => {
  if (!data.startLocation || !data.endLocation) {
    throw new Error("Start and End locations are required");
  }
  return await routeRepository.createRoute(data);
};

const updateRoute = async (id, data) => {
  return await routeRepository.updateRoute(id, data);
};

const deleteRoute = async (id) => {
  return await routeRepository.deleteRoute(id);
};

module.exports = {
  getAllRoutes,
  getRouteById,
  createRoute,
  updateRoute,
  deleteRoute,
};
