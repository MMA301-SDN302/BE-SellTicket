import * as service from "../services/location.service.js";
import { OK, CREATED } from "../core/response/success.response.js";
import {
  NotFoundError,
  BadRequestError,
} from "../core/response/error.response.js";


export const getAllLocations = async (req, res) => {
    const locations = await service.getAllLocations();
    return new OK({
      message: "Location retrieved successfully",
      metadata: locations,
    }).send(req,res);
};

export const getLocationById = async (req, res) => {
    const location = await service.getLocationById(req.params.id);
    if (!location) {
      throw new NotFoundError();
    }
    return new OK({
      message: "Location retrieved successfully",
      metadata: location,
    }).send(res);
};

export const createLocation = async (req, res) => {

    if (!req.body.location_name)
      throw new BadRequestError();
    const newLocation = await service.createLocation(req.body);
    return new CREATED({
      message: "Location created successfully",
      metadata: newLocation,
    }).send(res);

};

export const updateLocation = async (req, res) => {
    const updatedLocation = await service.updateLocation(
      req.params.id,
      req.body
    );
    if (!updatedLocation) throw new NotFoundError("Location not found");
    return new OK({
      message: "Location updated successfully",
      metadata: updatedLocation,
    }).send(res);
 
};

export const deleteLocation = async (req, res) => {

    const deletedLocation = await service.deleteLocation(req.params.id);
    if (!deletedLocation) throw new NotFoundError("Location not found");
    return new OK({ message: "Location deleted successfully" }).send(res);
};
