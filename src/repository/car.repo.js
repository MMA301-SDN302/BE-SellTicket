const Car = require("../models/BusCompany/Car");

const getAllCars = async () => {
  return await Car.find();
};

const getCarById = async (_id) => {
  return await Car.findOne({ _id });
};

const createCar = async (data) => {
  return await Car.create(data);
};

const updateCar = async (_id, data) => {
  return await Car.findOneAndUpdate({ _id }, data, { new: true });
};

const deleteCar = async (_id) => {
  return await Car.findOneAndDelete({ _id });
};

const getCarByCode = async (carCode) => {
  try {
    const car = await Car.findOne({ car_code: carCode });
    if (!car) {
      throw new Error("Car not found");
    }
    return car;
  } catch (error) {
    console.error("Error fetching car by code:", error);
    throw error;
  }
};
module.exports = {
  getAllCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
  getCarByCode
};
