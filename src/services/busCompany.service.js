const busCompanyRepository = require("../repository/busCompany.repo.js");

const getAllBusCompanies = async () => {
  return await busCompanyRepository.getAllBusCompanies();
};

const getBusCompanyById = async (_id) => {
  return await busCompanyRepository.getBusCompanyById(_id);
};

const createBusCompany = async (data) => {
  if (!data.bus_company_name) {
    throw new Error("Bus company name is required");
  }
  return await busCompanyRepository.createBusCompany(data);
};

const updateBusCompany = async (_id, data) => {
  return await busCompanyRepository.updateBusCompany(_id, data);
};

const deleteBusCompany = async (_id) => {
  return await busCompanyRepository.deleteBusCompany(_id);
};

module.exports = {
  getAllBusCompanies,
  getBusCompanyById,
  createBusCompany,
  updateBusCompany,
  deleteBusCompany,
};
