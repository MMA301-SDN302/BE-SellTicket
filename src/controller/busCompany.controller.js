const service = require("../services/busCompany.service.js");
const { OK, CREATED } = require("../core/response/success.response.js");
const {
  NotFoundError,
  BadRequestError,
} = require("../core/response/error.response.js");

const getAllBusCompanies = async (req, res) => {
  const busCompanies = await service.getAllBusCompanies();
  return new OK({
    message: "Bus companies retrieved successfully",
    metadata: busCompanies,
  }).send(req, res);
};

const getBusCompanyById = async (req, res) => {
  const busCompany = await service.getBusCompanyById(req.params._id);
  if (!busCompany) {
    throw new NotFoundError("Bus company not found");
  }
  return new OK({
    message: "Bus company retrieved successfully",
    metadata: busCompany,
  }).send(req, res);
};

const createBusCompany = async (req, res) => {
  if (!req.body.bus_company_name)
    throw new BadRequestError("Bus company name is required");

  const newBusCompany = await service.createBusCompany(req.body);
  return new CREATED({
    message: "Bus company created successfully",
    metadata: newBusCompany,
  }).send(req, res);
};

const updateBusCompany = async (req, res) => {
  const updatedBusCompany = await service.updateBusCompany(
    req.params._id,
    req.body
  );
  if (!updatedBusCompany) throw new NotFoundError("Bus company not found");

  return new OK({
    message: "Bus company updated successfully",
    metadata: updatedBusCompany,
  }).send(req, res);
};

const deleteBusCompany = async (req, res) => {
  const deletedBusCompany = await service.deleteBusCompany(req.params._id);
  if (!deletedBusCompany) throw new NotFoundError("Bus company not found");

  return new OK({ message: "Bus company deleted successfully" }).send(req, res);
};

module.exports = {
  getAllBusCompanies,
  getBusCompanyById,
  createBusCompany,
  updateBusCompany,
  deleteBusCompany,
};
