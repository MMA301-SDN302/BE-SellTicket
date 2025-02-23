const routeRepository = require("../repository/route.repo.js")
const Location = require("../models/BusCompany/Location.js")
const Route = require("../models/BusCompany/Route.js")
const Seat = require("../models/BusCompany/Seat.js")
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
    const startLocation = await Location.findOne({ location_name: startLocationName });
    const endLocation = await Location.findOne({ location_name: endLocationName });

    if (!startLocation || !endLocation) {
      throw new Error("Không tìm thấy địa điểm phù hợp.");
    }

    const [day, month, year] = timeStart.split("/").map(Number);
    const startDate = new Date(year, month - 1, day, 0, 0, 0);
    const endDate = new Date(year, month - 1, day, 23, 59, 59);

    const routes = await Route.find({
      startLocation: startLocation._id,
      endLocation: endLocation._id,
      routeStartTime: { $gte: startDate, $lte: endDate }
    })
      .populate({
        path: "car",
        populate: { path: "bus_company_id", model: "BusCompany" } // Lấy thông tin nhà xe
      })
      .populate("startLocation endLocation");

    for (let route of routes) {
      const remainingSeats = await Seat.countDocuments({ route: route._id, isAvailable: true });
      await Route.findByIdAndUpdate(route._id, { remainingSeat: remainingSeats });

      route.remainingSeat = remainingSeats;
      console.log(`Chuyến: ${route.name}, Số ghế còn lại: ${remainingSeats}`);
    }

    return routes;
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
