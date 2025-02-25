const busCompanyRepository = require("../repository/buscompany.repo.js");

const getAllBusCompanies = async () => {
  return await busCompanyRepository.getAllBusCompanies();
};

const getBusCompanyById = async (id) => {
  return await busCompanyRepository.getBusCompanyById(id);
};

const createBusCompany = async (data) => {
  if (!data.bus_company_name) {
    throw new Error("Bus company name is required");
  }
  return await busCompanyRepository.createBusCompany(data);
};

const updateBusCompany = async (id, data) => {
  return await busCompanyRepository.updateBusCompany(id, data);
};

const deleteBusCompany = async (id) => {
  return await busCompanyRepository.deleteBusCompany(id);
};

module.exports = {
  getAllBusCompanies,
  getBusCompanyById,
  createBusCompany,
  updateBusCompany,
  deleteBusCompany,
};
