const Car = require("../models/BusCompany/Car");

const getAllCars = async () => {
  return await Car.find();
};

const getCarById = async (id) => {
  return await Car.findOne({ car_id: id });
};

const createCar = async (data) => {
  return await Car.create(data);
};

const updateCar = async (id, data) => {
  return await Car.findOneAndUpdate({ car_id: id }, data, { new: true });
};

const deleteCar = async (id) => {
  return await Car.findOneAndDelete({ car_id: id });
};

module.exports = {
  getAllCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
};
