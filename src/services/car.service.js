const carRepository = require("../repository/car.repo");

const getAllCars = async () => {
  return await carRepository.getAllCars();
};

const getCarById = async (id) => {
  return await carRepository.getCarById(id);
};

const createCar = async (data) => {
  if (!data.car_code || !data.amount_seat) {
    throw new Error("Car code and amount seat are required");
  }
  return await carRepository.createCar(data);
};

const updateCar = async (id, data) => {
  return await carRepository.updateCar(id, data);
};

const deleteCar = async (id) => {
  return await carRepository.deleteCar(id);
};

module.exports = {
  getAllCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
};
