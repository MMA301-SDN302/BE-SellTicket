const {
  deleteTripsByRoute,
  getTripById,
  getTrips,
} = require("../repository/trip.repo.js");
const { OK, CREATED } = require("../core/response/success.response.js");
const tripService = require("../services/trip.service");
const { InternalServerError } = require("../core/response/error.response.js");
const createTripController = async (req, res, next) => {
  return new CREATED({
    message: "Tạo chuyến đi thành công",
    metadata: await tripService.createTrips(req.body),
  }).send(req, res);
};

const deleteTripController = async (req, res, next) => {
  try {
    console.log("req.params", req.params);
    const cancelled = await deleteTripsByRoute(req.params._id);

    res.status(200).json({
      message: "Ticket cancelled successfully",
      metadata: cancelled,
    });
  } catch (error) {
    console.error("Error deleting trip:", error.message);
    res.status(500).json({ error: error.message });
  }
};
const getTripByIdController = async (req, res) => {
  const ticket = await getTripById(req.params._id);
  if (!ticket) {
    throw new NotFoundError("Ticket not found");
  }
  return new OK({
    message: "Ticket retrieved successfully",
    metadata: ticket,
  }).send(res);
};
async function createAutoTrip(req, res) {
  try {
    const trips = await tripService.createAutoTrip();
    return new CREATED({
      message: "Tạo chuyến đi tự động cho 30 ngày thành công.",
      metadata: trips,
    }).send(req, res);
  } catch (error) {
    console.error("Lỗi khi tạo chuyến đi tự động:", err);

    // Sử dụng common error response
    throw new InternalServerError("Lỗi khi tạo chuyến đi tự động", err.message);
  }
}

const getAllTrips = async (req, res) => {
  return new OK({
    message: "Danh sách chuyến đi",
    metadata: await getTrips(),
  }).send(req, res);
};
module.exports = {
  createTripController,
  deleteTripController,
  getTripByIdController,
  createAutoTrip,
  getAllTrips,
};
