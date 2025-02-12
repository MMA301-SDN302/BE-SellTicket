const Location = require("../models/BusCompany/Location");

const getAllLocations = async () => {
  return await Location.find();
};

const getLocationById = async (id) => {
  return await Location.findOne({ location_id: id });
};

const createLocation = async (data) => {
  return await Location.create(data);
};

const updateLocation = async (id, data) => {
  return await Location.findOneAndUpdate({ location_id: id }, data, {
    new: true,
  });
};

const deleteLocation = async (id) => {
  return await Location.findOneAndDelete({ location_id: id });
};

module.exports = {
  getAllLocations,
  getLocationById,
  createLocation,
  updateLocation,
  deleteLocation,
};
