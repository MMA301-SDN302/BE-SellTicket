const service = require("../services/location.service.js");
const { OK, CREATED } = require("../core/response/success.response.js");
const {
  NotFoundError,
  BadRequestError,
} = require("../core/response/error.response.js");

<<<<<<< HEAD
export const getAllLocations = async (req, res) => {
=======
const getAllLocations = async (req, res) => {
>>>>>>> f5c7c481934793760027da920902a3f951c9af59
  const locations = await service.getAllLocations();
  return new OK({
    message: "Location retrieved successfully",
    metadata: locations,
  }).send(req, res);
};

<<<<<<< HEAD
export const getLocationById = async (req, res) => {
  const location = await service.getLocationById(req.params._id); // Sử dụng _id trong params
=======
const getLocationById = async (req, res) => {
  const location = await service.getLocationById(req.params.id);
>>>>>>> f5c7c481934793760027da920902a3f951c9af59
  if (!location) {
    throw new NotFoundError();
  }
  return new OK({
    message: "Location retrieved successfully",
    metadata: location,
  }).send(req, res);
};

export const createLocation = async (req, res) => {
  if (!req.body.location_name)
    throw new BadRequestError();
  const newLocation = await service.createLocation(req.body);
  return new CREATED({
    message: "Location created successfully",
    metadata: newLocation,
  }).send(req, res);
};

export const updateLocation = async (req, res) => {
  const updatedLocation = await service.updateLocation(
    req.params._id,  // Sử dụng _id từ params
    req.body
  );
  if (!updatedLocation) throw new NotFoundError("Location not found");
  return new OK({
    message: "Location updated successfully",
    metadata: updatedLocation,
  }).send(req, res);
};

export const deleteLocation = async (req, res) => {
  const deletedLocation = await service.deleteLocation(req.params._id); // Sử dụng _id từ params
  if (!deletedLocation) throw new NotFoundError("Location not found");
  return new OK({ message: "Location deleted successfully" }).send(req, res);
};
