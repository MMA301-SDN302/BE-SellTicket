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
<<<<<<< HEAD
  }).send(req,res);
};


export const getCarById = async (req, res) => {
  const car = await service.getCarById(req.params._id);
=======
  }).send(req, res);
};

const getCarById = async (req, res) => {
  const car = await service.getCarById(req.params.id);
>>>>>>> f5c7c481934793760027da920902a3f951c9af59
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
  }).send(req,res);
};

export const updateCar = async (req, res) => {
  const updatedCar = await service.updateCar(req.params._id, req.body);
  if (!updatedCar) throw new NotFoundError("Car not found");
  return new OK({
    message: "Car updated successfully",
    metadata: updatedCar,
  }).send(req,res);
};

export const deleteCar = async (req, res) => {
  const deletedCar = await service.deleteCar(req.params._id);
  if (!deletedCar) throw new NotFoundError("Car not found");
  return new OK({ message: "Car deleted successfully" }).send(req,res);
};
