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

module.exports = {
  getAllCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
};
