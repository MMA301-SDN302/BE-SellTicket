const routeRepository = require("../repository/route.repo.js");
const Route = require("../models/BusCompany/Route.js");
const Seat = require("../models/BusCompany/Seat.js");
const Trip = require("../models/BusCompany/Trip.js");
const StopMap = require("../models/BusCompany/StopMap.js");
const { BadRequestError, InternalServerError } = require("../core/response/error.response.js");

const getAllRoutes = async () => {
  return await routeRepository.getAllRoutes();
};

const getRouteById = async (_id) => {
  return await routeRepository.getRouteById(_id);
};

const createRoute = async (data) => {
  if (!data.startLocation || !data.endLocation) {
    throw new Error("Start and End locations are required");
  }
  return await routeRepository.createRoute(data);
};

const updateRoute = async (_id, data) => {
  return await routeRepository.updateRoute(_id, data);
};

const deleteRoute = async (_id) => {
  return await routeRepository.deleteRoute(_id);
};

const getCarByRoute = async (startLocationName, endLocationName, timeStart) => {
  try {
    const [day, month, year] = timeStart.split("/").map(Number);
    const startDate = new Date(year, month - 1, day, 0, 0, 0);
    const endDate = new Date(year, month - 1, day + 4, 23, 59, 59);

    const routes = await routeRepository.getRouteBySearch(startDate, endDate);
    if (!routes || routes.length === 0) {
      throw new BadRequestError("Không tìm thấy tuyến xe nào trong khoảng thời gian này.");
    }

    const result = [];

    for (let route of routes) {
      const startStop = route.stopMap.find(stop => stop.name === startLocationName);
      const endStop = route.stopMap.find(stop => stop.name === endLocationName);

      console.log("Start Stop:", startStop, "End Stop:", endStop);

      if (!startStop || !endStop) continue;
      if (!route.trip) continue; 

      if (route.stopMap.indexOf(startStop) >= route.stopMap.indexOf(endStop)) continue;

      const remainingSeats = await Seat.countDocuments({ route: route._id, isAvailable: true });

      const timeStartLocationPart = new Date(route.routeStartTime);
      timeStartLocationPart.setMinutes(timeStartLocationPart.getMinutes() + startStop.offsetTime);

      const timeEndLocationPart = new Date(route.routeStartTime);
      timeEndLocationPart.setMinutes(timeEndLocationPart.getMinutes() + endStop.offsetTime);

      const totalStops = route.stopMap.length - 1; 
      const distanceRatio = Math.abs(route.stopMap.indexOf(endStop) - route.stopMap.indexOf(startStop)) / totalStops;
      const pricePart = Math.round(route.trip.price * distanceRatio);

      result.push({
        ...route.toObject(),
        remainingSeat: remainingSeats,
        pricePart,
        timeStartLocationPart,
        timeEndLocationPart,
      });
    }
    

    return result;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách tuyến:", error);
    throw error;
  }
};

const createDefaultRouter = async (tripId) => {
  const trip = await Trip.findById(tripId).populate("car");
  for (let i = 1; i < 31; i++) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + i);
    const startTime = trip.stopMap[0].time.split(":");
    startDate.setHours(startTime[0], startTime[1], 0);
    const offsetEndTime = trip.stopMap[trip.stopMap.length - 1].offsetTime;
    const endTime = new Date(startDate.getTime() + offsetEndTime * 60 * 1000);

    const newTrip = await Route.create({
      car: trip.car._id,
      trip: trip._id,
      name: `${trip.stopMap[0].name} - ${
        trip.stopMap[trip.stopMap.length - 1].name
      }`,
      routeDescription: `Chuyến đi ngày ${startDate.getDate()}/${
        startDate.getMonth() + 1
      }/${startDate.getFullYear()}`,
      routeStartTime: startDate,
      routeEndTime: endTime,
      stopMap: trip.stopMap,
      remainingSeat: trip.car.amount_seat,
    });

    const seatsToCreate = [];
    // sửa số ghế ở đây
    const seatFloor = ["A", "B", "C", "D", "E", "F"];
    for (let k = 0; k < trip.car.amount_seat; k++) {
      seatsToCreate.push({
        insertOne: {
          document: {
            route: newTrip._id,
            floor: Math.floor(k / (trip.car.amount_seat / 2)) + 1,
            seatNumber: seatFloor[k % 6] + Math.floor(k / 6),
            isAvailable: true,
          },
        },
      });
    }
    seatsToCreate.length > 0 && (await Seat.bulkWrite(seatsToCreate));
  }
};

const createDailyRouter = async (trip) => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() + 30);
  const startTime = trip.stopMap[0].time.split(":");
  startDate.setHours(startTime[0], startTime[1], 0);
  const offsetEndTime = trip.stopMap[trip.stopMap.length - 1].offsetTime;
  const endTime = new Date(startDate.getTime() + offsetEndTime * 60 * 1000);

  const newTrip = await Route.create({
    car: trip.car._id,
    trip: trip._id,
    name: `${trip.stopMap[0].name} - ${
      trip.stopMap[trip.stopMap.length - 1].name
    }`,
    routeDescription: `Chuyến đi ngày ${startDate.getDate()}/${
      startDate.getMonth() + 1
    }/${startDate.getFullYear()}`,
    routeStartTime: startDate,
    routeEndTime: endTime,
    stopMap: trip.stopMap,
    remainingSeat: trip.car.amount_seat,
  });

  const seatsToCreate = [];
  // sửa số ghế ở đây
  const seatFloor = ["A", "B", "C", "D", "E", "F"];
  for (let k = 0; k < trip.car.amount_seat; k++) {
    seatsToCreate.push({
      insertOne: {
        document: {
          route: newTrip._id,
          floor: Math.floor(k / (trip.car.amount_seat / 2)) + 1,
          seatNumber: seatFloor[k % 6] + Math.floor(k / 6),
          isAvailable: true,
        },
      },
    });
  }
  seatsToCreate.length > 0 && (await Seat.bulkWrite(seatsToCreate));
};

const getStopMap = async (startLocation, endLocation, label) => {
  try {
    const stopMapData = await StopMap.findOne().lean();

    if (!stopMapData || !stopMapData.stops) {
      return [];
    }

    let stops = stopMapData.stops;

    if (label === 1 && startLocation) {
      stops = stops.filter(
        (stop) =>
          stop.stop_name.toLowerCase().includes(startLocation.toLowerCase()) &&
          stop.stop_name.toLowerCase() !== startLocation.toLowerCase()
      );
    } else if (label === 2 && endLocation) {
      stops = stops.filter(
        (stop) =>
          stop.stop_name.toLowerCase().includes(endLocation.toLowerCase()) &&
          stop.stop_name.toLowerCase() !== endLocation.toLowerCase()
      );
    }

    return stops.map((stop) => ({
      stop_id: stop.stop_id,
      stop_name: stop.stop_name,
      latitude: stop.latitude,
      longitude: stop.longitude,
    }));
  } catch (error) {
    console.error("Lỗi khi lấy danh sách điểm dừng:", error);
    throw new Error("Không thể lấy danh sách điểm dừng.");
  }
};

module.exports = {
  getAllRoutes,
  getRouteById,
  createRoute,
  updateRoute,
  deleteRoute,
  getCarByRoute,
  createDefaultRouter,
  createDailyRouter,
  getStopMap,
};
