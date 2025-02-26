const service = require("../services/car.service.js");
const { OK, CREATED } = require("../core/response/success.response.js");
const {
  NotFoundError,
  BadRequestError,
} = require("../core/response/error.response.js");

const getAllCars = async (req, res) => {
  const cars = await service.getAllCars();
  return new OK({
    message: "Cars retrieved successfully",
    metadata: cars,
  }).send(req, res);
};

const getCarById = async (req, res) => {
  const car = await service.getCarById(req.params.id);
  if (!car) throw new NotFoundError();
  return new OK({
    message: "Car retrieved successfully",
    metadata: car,
  }).send(req, res);
};

const createCar = async (req, res) => {
  if (!req.body.car_code || !req.body.amount_seat) throw new BadRequestError();
  const newCar = await service.createCar(req.body);
  return new CREATED({
    message: "Car created successfully",
    metadata: newCar,
  }).send(req, res);
};

const updateCar = async (req, res) => {
  const updatedCar = await service.updateCar(req.params.id, req.body);
  if (!updatedCar) throw new NotFoundError("Car not found");
  return new OK({
    message: "Car updated successfully",
    metadata: updatedCar,
  }).send(req, res);
};

const deleteCar = async (req, res) => {
  const deletedCar = await service.deleteCar(req.params.id);
  if (!deletedCar) throw new NotFoundError("Car not found");
  return new OK({ message: "Car deleted successfully" }).send(req, res);
};
const getCarStatistics = async (req, res) => {
  const busCompanyId = req.params._id; // Get the bus company ID from the request params

  // Validate if the busCompanyId exists
  if (!busCompanyId) {
    throw new BadRequestError("Bus Company ID is required");
  }

  const carCount = await carService.getCarStatisticsByBusCompany(busCompanyId);

  // If no cars are found, we return a NotFoundError
  if (carCount === 0) {
    throw new NotFoundError(`No cars found for Bus Company ID ${busCompanyId}`);
  }

  return new OK({
    message: `Car count for BusCompany ${busCompanyId}`,
    metadata: { totalCars: carCount },
  }).send(req, res);
};
module.exports = {
  getAllCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
  getCarStatistics,
};
