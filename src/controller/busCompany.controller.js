import * as service from "../services/busCompany.service.js";
import { OK, CREATED } from "../core/response/success.response.js";
import { NotFoundError, BadRequestError } from "../core/response/error.response.js";

export const getAllBusCompanies = async (req, res) => {
  const busCompanies = await service.getAllBusCompanies();
  return new OK({
    message: "Bus companies retrieved successfully",
    metadata: busCompanies,
  }).send(res);
};

export const getBusCompanyById = async (req, res) => {
  const busCompany = await service.getBusCompanyById(req.params.id);
  if (!busCompany) {
    throw new NotFoundError("Bus company not found");
  }
  return new OK({
    message: "Bus company retrieved successfully",
    metadata: busCompany,
  }).send(res);
};

export const createBusCompany = async (req, res) => {
  if (!req.body.bus_company_name) throw new BadRequestError("Bus company name is required");
  
  const newBusCompany = await service.createBusCompany(req.body);
  return new CREATED({
    message: "Bus company created successfully",
    metadata: newBusCompany,
  }).send(res);
};

export const updateBusCompany = async (req, res) => {
  const updatedBusCompany = await service.updateBusCompany(req.params.id, req.body);
  if (!updatedBusCompany) throw new NotFoundError("Bus company not found");

  return new OK({
    message: "Bus company updated successfully",
    metadata: updatedBusCompany,
  }).send(res);
};

export const deleteBusCompany = async (req, res) => {
  const deletedBusCompany = await service.deleteBusCompany(req.params.id);
  if (!deletedBusCompany) throw new NotFoundError("Bus company not found");

  return new OK({ message: "Bus company deleted successfully" }).send(res);
};
