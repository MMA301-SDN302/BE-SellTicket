const locationRepository = require("../repository/location.repo.js");

const getAllLocations = async () => {
  return await locationRepository.getAllLocations();
};

const getLocationById = async (id) => {
  return await locationRepository.getLocationById(id);
};

const createLocation = async (data) => {
  if (!data.location_name) {
    throw new Error("Location name is required");
  }
  return await locationRepository.createLocation(data);
};

const updateLocation = async (id, data) => {
  return await locationRepository.updateLocation(id, data);
};

const deleteLocation = async (id) => {
  return await locationRepository.deleteLocation(id);
};

module.exports = {
  getAllLocations,
  getLocationById,
  createLocation,
  updateLocation,
  deleteLocation,
};
