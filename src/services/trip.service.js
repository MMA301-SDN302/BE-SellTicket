const cron = require("node-cron");
const Car = require("../models/BusCompany/Car");
const Route = require("../models/BusCompany/Route");
const StopMap = require("../models/BusCompany/StopMap");
const { BadRequestError } = require("../core/response/error.response");
const Trip = require("../models/BusCompany/Trip");
const Seat = require("../models/BusCompany/Seat");
const geolib = require("geolib");

async function createAutoTrip() {
  try {
    const car = await Car.findOne({});
    const route = await Route.findOne({});
    const stopMap = await StopMap.findOne({});

    if (!car || !route || !stopMap) {
      throw new BadRequestError("Không tìm thấy phương tiện, lộ trình hoặc bản đồ dừng", "NOT_FOUND");
    }

    let tripsCreated = [];
    let seatsToCreate = [];
    
    const travelSpeed = 60; // Tốc độ di chuyển (km/h)
    const turnaroundTime = 5 * 60 * 60 * 1000; // Thời gian nghỉ giữa các chuyến 

    for (let i = 0; i < 30; i++) {
      let tripDate = new Date(route.routeStartTime);
      if (i > 0) {
        tripDate = new Date(tripsCreated[i - 1].estimatedArrivalDate.getTime() + turnaroundTime);
      }

      let currentTime = new Date(tripDate);

      for (let j = 0; j < stopMap.stops.length - 1; j++) {
        const origin = stopMap.stops[j];
        const destination = stopMap.stops[j + 1];

        if (!origin.latitude || !origin.longitude || !destination.latitude || !destination.longitude) {
          throw new BadRequestError(
            `Không có tọa độ cho điểm dừng: ${origin.stop_name} hoặc ${destination.stop_name}`,
            "INVALID_COORDINATES"
          );
        }

        const distance = geolib.getDistance(
          { latitude: origin.latitude, longitude: origin.longitude },
          { latitude: destination.latitude, longitude: destination.longitude }
        );

        const travelTimeInHours = (distance / 1000) / travelSpeed;
        const travelTimeInMilliseconds = travelTimeInHours * 60 * 60 * 1000;

        const estimatedArrivalTime = new Date(currentTime.getTime() + travelTimeInMilliseconds);

        stopMap.stops[j].estimatedArrivalTime = estimatedArrivalTime;
        currentTime = estimatedArrivalTime;
      }

      await stopMap.save();

      if (isNaN(currentTime.getTime())) {
        throw new BadRequestError("Ngày đến ước chừng không hợp lệ", "INVALID_DATE");
      }

      const newTrip = new Trip({
        car: car._id,
        depature: route.startLocation,
        arrive: route.endLocation,
        price: 1000,
        isDaily: true,
        tripDate: tripDate,
        estimatedArrivalDate: currentTime,
      });

      const saveTrip = await newTrip.save();
      tripsCreated.push(saveTrip);

      for (let k = 0; k < route.remainingSeat; k++) {
        seatsToCreate.push({
          insertOne: {
            document: {
              trip: saveTrip._id,
              floor: Math.floor(k / (route.remainingSeat / 3)) + 1,
              seatNumber: `S${k}`,
              isAvailable: true,
            },
          },
        });
      }
    }

    if (seatsToCreate.length > 0) {
      await Seat.bulkWrite(seatsToCreate);
    }

    console.log("Tạo chuyến đi thành công:", tripsCreated.length);
    return tripsCreated;
  } catch (err) {
    console.error("Lỗi khi tạo chuyến đi tự động:", err.message);
    throw err;
  }
}

module.exports = {
  createAutoTrip,
};
