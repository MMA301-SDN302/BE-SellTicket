const routeRepository = require("../repository/route.repo.js")
const Location = require("../models/BusCompany/Location.js")
const Route = require("../models/BusCompany/Route.js")
const Seat = require("../models/BusCompany/Seat.js")
const StopMap = require("../models/BusCompany/StopMap.js")

const getAllRoutes = async () => {
  return await routeRepository.getAllRoutes();
};

const getRouteById = async (id) => {
  return await routeRepository.getRouteById(id);
};

const createRoute = async (data) => {
  if (!data.startLocation || !data.endLocation) {
    throw new Error("Start and End locations are required");
  }
  return await routeRepository.createRoute(data);
};

const updateRoute = async (id, data) => {
  return await routeRepository.updateRoute(id, data);
};

const deleteRoute = async (id) => {
  return await routeRepository.deleteRoute(id);
};

const getCarByRoute = async (startLocationName, endLocationName, timeStart) => {
  try {
    const stopMap = await StopMap.findOne();
    if (!stopMap) throw new Error("Không tìm thấy dữ liệu điểm dừng.");

    const userStartStop = stopMap.stops.find(stop => stop.stop_name === startLocationName);
    const userEndStop = stopMap.stops.find(stop => stop.stop_name === endLocationName);

    if (!userStartStop || !userEndStop) {
      throw new Error("Không tìm thấy điểm dừng phù hợp.");
    }

    const [day, month, year] = timeStart.split("/").map(Number);
    const startDate = new Date(year, month - 1, day, 0, 0, 0);
    const endDate = new Date(year, month - 1, day + 4, 23, 59, 59);

    const routes = await Route.find({
      routeStartTime: { $gte: startDate, $lte: endDate }
    })
      .populate({
        path: "car",
        populate: { path: "bus_company_id", model: "BusCompany" }
      })
      .populate("startLocation endLocation stopMap");

    const result = [];

    for (let route of routes) {
      const remainingSeats = await Seat.countDocuments({ routes: route._id, isAvailable: true });

      const routeStartStop = stopMap.stops.find(stop => stop.stop_name === route.startLocation.location_name);
      const routeEndStop = stopMap.stops.find(stop => stop.stop_name === route.endLocation.location_name);

      if (!routeStartStop || !routeEndStop) continue;

      if (userStartStop.stop_id < routeStartStop.stop_id || userEndStop.stop_id > routeEndStop.stop_id) {
        continue; // Chỉ lấy tuyến có bao phủ chặng nhỏ hơn
      }

      let pricePart = route.price;
      if (routeStartStop && routeEndStop) {
        const priceRatio = Math.abs(userStartStop.stop_id - userEndStop.stop_id) / 
                           Math.abs(routeStartStop.stop_id - routeEndStop.stop_id);
        pricePart = Math.round(route.price * priceRatio);
      }

      const totalDuration = route.routeEndTime - route.routeStartTime;
      const timeStartLocationPart = new Date(route.routeStartTime.getTime() + 
        ((userStartStop.stop_id - routeStartStop.stop_id) / (routeEndStop.stop_id - routeStartStop.stop_id)) * totalDuration);
      const timeEndLocationPart = new Date(route.routeStartTime.getTime() + 
        ((userEndStop.stop_id - routeStartStop.stop_id) / (routeEndStop.stop_id - routeStartStop.stop_id)) * totalDuration);

      result.push({
        ...route.toObject(),
        remainingSeat: remainingSeats,
        pricePart: pricePart,
        timeStartLocationPart,
        timeEndLocationPart
      });

      console.log(`Chuyến: ${route.name}, Giá tiền: ${pricePart}, Số ghế còn lại: ${remainingSeats}`);
      console.log(`Thời gian dự kiến đi qua ${startLocationName}: ${timeStartLocationPart}`);
      console.log(`Thời gian dự kiến đi qua ${endLocationName}: ${timeEndLocationPart}`);
    }

    return result;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách tuyến:", error.message);
    throw error;
  }
};

module.exports = {
  getAllRoutes,
  getRouteById,
  createRoute,
  updateRoute,
  deleteRoute,
  getCarByRoute,
};
