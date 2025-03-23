const seatService = require("../services/seat.service.js");
const crypto = require("crypto");
const { OK } = require("../core/response/success.response.js");
const { InternalServerError } = require("../core/response/error.response.js");

const getCarSeatController = async (req, res) => {
  try {
    const { routeId, from, to } = req.query;

    if (!routeId || !from || !to) {
      return res.status(400).json({
        status: "error",
        code: 400,
        message: "Thiếu thông tin để lấy ghế",
      });
    }

    const seats = await seatService.getSeatsByRoute(routeId, from, to);

    return new OK({ message: "Lấy danh sách ghế thành công", metadata: seats }).send(req, res);
  } catch (error) {
    console.error("getCarSeatController error:", error);

    return res.status(500).json({
      status: "error",
      code: 500,
      message: "Lỗi máy chủ nội bộ",
    });
  }
};

const getSeatStatusController = async (req, res) => {
  try {
    const { routeId, seatId } = req.query;

    if (!routeId || !seatId) {
      return res.status(400).json({
        status: "error",
        code: 400,
        message: "Thiếu thông tin để lấy trạng thái ghế",
      });
    }

    const seatStatus = await seatService.getSeatStatus(routeId, seatId);

    return new OK({ message: "Lấy trạng thái ghế thành công", metadata: seatStatus }).send(req, res);
  } catch (error) {
    console.error("getSeatStatusController error:", error);

    return res.status(500).json({
      status: "error",
      code: 500,
      message: "Lỗi máy chủ nội bộ",
    });
  }
};

const createTicketController = async (req, res) => {
  try {
    let { routeId, seatIds, userId, from, to, price } = req.body; 
    let missingFields = [];

    if (!routeId) missingFields.push("routeId");
    if (!Array.isArray(seatIds) || seatIds.length === 0) missingFields.push("seatIds");
    if (!userId) userId = crypto.randomBytes(12).toString("hex");
    if (!from) missingFields.push("from");
    if (!to) missingFields.push("to");
    if (price === undefined || price === null) missingFields.push("price"); 

    if (missingFields.length > 0) {
      return res.status(400).json({
        status: "error",
        code: 400,
        message: `Thiếu thông tin để tạo vé: ${missingFields.join(", ")}`,
      });
    }

    const ticket = await seatService.createTicket(routeId, seatIds, userId, from, to, price);

    return new OK({ message: "Tạo vé thành công", metadata: ticket }).send(req, res);
  } catch (error) {
    console.error("createTicketController error:", error);

    return res.status(500).json({
      status: "error",
      code: 500,
      message: error.message,
    });
  }
};

module.exports = {
  getCarSeatController,
  getSeatStatusController,
  createTicketController,
};
