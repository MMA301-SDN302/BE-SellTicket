const cron = require("node-cron");
const Car = require("../models/BusCompany/Car");
const Route = require("../models/BusCompany/Route");
const StopMap = require("../models/BusCompany/StopMap");
const { BadRequestError } = require("../core/response/error.response");
const Trip = require("../models/BusCompany/Trip");
const ERROR_CODES = require("../core/errorConstant/errorCodes");
const Seat = require("../models/BusCompany/Seat");
async function createAutoTrip() {
  try {
    const car = await Car.findOne({});
    const route = await Route.findOne({});
    const stopMap = await StopMap.findOne({});

    if (!car || !route || !stopMap) {
      throw new BadRequestError(
        "Không tìm thấy phương tiện, lộ trình hoặc bản đồ dừng",
        "NOT_FOUND"
      );
    }

    let tripsCreated = [];
    let seatsToCreate = [];

    for (let i = 0; i < 30; i++) {
      const tripDate = new Date();
      tripDate.setDate(tripDate.getDate() + i);

      const newTrip = new Trip({
        car: car._id,
        depature: route.startLocation,
        arrive: route.endLocation,
        price: 500,
        isDaily: true,
        tripDate: tripDate,
      });

      const saveTrip = await newTrip.save();
      tripsCreated.push(saveTrip);

      for (let i = 0; i < route.remainingSeat; i++) {
        seatsToCreate.push({
          insertOne: {
            document: {
              route: route._id,
              floor: i <= route.remainingSeat / 2 ? 1 : 2,
              seatNumber: `S${i}`,
              isAvailable: true,
            },
          },
        });
      }
      if (seatsToCreate.length > 0) {
        await Seat.bulkWrite(seatsToCreate); 
        seatsToCreate = []; 
      }
    }
    return tripsCreated;
  } catch (err) {
    console.error("Lỗi khi tạo chuyến đi tự động:", err.message);
    throw err;
  }
}

module.exports = {
  createAutoTrip,
};
