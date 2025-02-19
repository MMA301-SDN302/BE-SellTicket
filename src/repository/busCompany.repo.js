const BusCompany = require("../models/BusCompany/BusCompany");

const getAllBusCompanies = async () => {
  return await BusCompany.find().populate("location_id");
};

const getBusCompanyById = async (id) => {
  return await BusCompany.findOne({ bus_company_id: id }).populate("location_id");
};

const createBusCompany = async (data) => {
  return await BusCompany.create(data);
};

const updateBusCompany = async (id, data) => {
  return await BusCompany.findOneAndUpdate({ bus_company_id: id }, data, { new: true });
};

const deleteBusCompany = async (id) => {
  return await BusCompany.findOneAndDelete({ bus_company_id: id });
};

module.exports = {
  getAllBusCompanies,
  getBusCompanyById,
  createBusCompany,
  updateBusCompany,
  deleteBusCompany,
};
