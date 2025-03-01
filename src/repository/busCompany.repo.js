const BusCompany = require("../models/BusCompany/BusCompany");

const getAllBusCompanies = async () => {
  return await BusCompany.find().populate("location_id");
};

const getBusCompanyById = async (_id) => {
  return await BusCompany.findOne({ _id }).populate("location_id");
};

const createBusCompany = async (data) => {
  return await BusCompany.create(data);
};

const updateBusCompany = async (_id, data) => {
  return await BusCompany.findOneAndUpdate({ _id }, data, { new: true });
};

const deleteBusCompany = async (_id) => {
  return await BusCompany.findOneAndDelete({ _id });
};

module.exports = {
  getAllBusCompanies,
  getBusCompanyById,
  createBusCompany,
  updateBusCompany,
  deleteBusCompany,
};
