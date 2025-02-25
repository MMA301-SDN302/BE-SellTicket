// repository/stopmap.repo.js

const StopMap = require("../models/BusCompany/StopMap");

const createStopMap = async (stopMapData) => {
  return await StopMap.create(stopMapData);
};

module.exports = {
  createStopMap,
};
