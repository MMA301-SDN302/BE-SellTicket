locationRepository = require("../repository/location.repo.js");

const getAllLocations = async () => {
  return await locationRepository.getAllLocations();
};

const getLocationById = async (_id) => {
  // Sử dụng _id thay vì location_id
  return await locationRepository.getLocationById(_id); // Dùng _id ở đây
};

const createLocation = async (data) => {
  if (!data.location_name) {
    throw new Error("Location name is required");
  }
  return await locationRepository.createLocation(data);
};

const updateLocation = async (_id, data) => {
  // Sử dụng _id thay vì location_id
  return await locationRepository.updateLocation(_id, data); // Dùng _id ở đây
};

const deleteLocation = async (_id) => {
  // Sử dụng _id thay vì location_id
  return await locationRepository.deleteLocation(_id); // Dùng _id ở đây
};

module.exports =  {
  getAllLocations,
  getLocationById,
  createLocation,
  updateLocation,
  deleteLocation,
};
