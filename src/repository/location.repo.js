const Location = require("../models/BusCompany/Location");

const getAllLocations = async () => {
  return await Location.find();
};

const getLocationById = async (_id) => {  // Sử dụng _id thay vì location_id
  return await Location.findOne({ _id });  // Dùng _id ở đây
};

const createLocation = async (data) => {
  return await Location.create(data);
};

const updateLocation = async (_id, data) => { // Sử dụng _id thay vì location_id
  return await Location.findOneAndUpdate({ _id }, data, {
    new: true,
  });
};

const deleteLocation = async (_id) => {  // Sử dụng _id thay vì location_id
  return await Location.findOneAndDelete({ _id });  // Dùng _id ở đây
};

// Hàm tìm kiếm Location theo tên
const getLocationByName = async (locationName) => {
  try {
    const location = await Location.findOne({ location_name: locationName });
    if (!location) {
      throw new Error("Location not found");
    }
    return location;
  } catch (error) {
    console.error("Error fetching location by name:", error);
    throw error;
  }
};
module.exports = {
  getAllLocations,
  getLocationById,
  createLocation,
  updateLocation,
  deleteLocation,
  getLocationByName
};
