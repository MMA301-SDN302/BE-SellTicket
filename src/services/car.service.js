const routeRepository = require("../repository/route.repo");
const carRepository = require("../repository/car.repo");
const BusCompany = require("../models/BusCompany/BusCompany");

const getAllRoutes = async () => {
  return await routeRepository.getAllRoutes();
};
const getAllCars = async () => {
  return await carRepository.getAllCars();
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
const getCarById = async (_id) => {
  return await carRepository.getCarById(_id);
};

const createCar = async (data) => {
  if (!data.car_code || !data.amount_seat) {
    throw new Error("Car code and amount seat are required");
  }
  return await carRepository.createCar(data);
};

const updateCar = async (_id, data) => {
  return await carRepository.updateCar(_id, data);
};

const deleteCar = async (_id) => {
  return await carRepository.deleteCar(_id);
};

const getCarStatisticsByBusCompany = async (_id) => {
  try {
    const objectId = mongoose.Types.ObjectId(_id);

    const carCount = await Car.aggregate([
      { $match: { buscompany_id: objectId } },
      { $count: "totalCars" },
    ]);

    return carCount[0] ? carCount[0].totalCars : 0;
  } catch (error) {
    console.error("Error fetching car statistics:", error);
    throw error;
  }
};
module.exports = {
  getAllRoutes,
  getAllCars,
  getRouteById,
  createRoute,
  updateRoute,
  deleteRoute,
  getCarByRoute,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
  getCarStatisticsByBusCompany,
};
