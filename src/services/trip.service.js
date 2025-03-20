const cron = require("node-cron");
const Car = require("../models/BusCompany/Car");
const Route = require("../models/BusCompany/Route");
const StopMap = require("../models/BusCompany/StopMap");
const { BadRequestError } = require("../core/response/error.response");
const Trip = require("../models/BusCompany/Trip");
const Seat = require("../models/BusCompany/Seat");
const geolib = require("geolib");
const { isMissingObjectData } = require("../utils");
const { createTrip, getTrips } = require("../repository/trip.repo");
const { createDefaultRouter, createDailyRouter } = require("./route.service");

async function createAutoTrip() {
  const trips = getTrips();
  for (const trip of trips) {
    await createDailyRouter(trip);
  }
}

const createTrips = async ({ car, stopMap, price, weekTimeRun }) => {
  const isValid = await isMissingObjectData({
    car,
    stopMap,
    price,
    weekTimeRun,
  });
  if (!isValid) {
    throw new BadRequestError("Thiếu thông tin", "MISSING_INFO");
  }
  // Create a new trip
  const res = await createTrip({ car, stopMap, price, weekTimeRun });
  // add 30 days trip to router
  await createDefaultRouter(res._id);
  return res;
};

module.exports = {
  createAutoTrip,
  createTrips,
};
