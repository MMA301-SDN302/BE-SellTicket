const seatService = require("../services/seat.service.js");
const { OK, NotFoundError } = require("../core/response/success.response.js");

const getCarSeatController = async (req, res) => {
  try {
    const { routeId, from, to } = req.query;

    if (!routeId || !from || !to) {
      throw new NotFoundError("Thiếu thông tin để lấy ghế");
    }

    const seats = await seatService.getSeatsByRoute(routeId, from, to);

    return new OK({ message: "Lấy danh sách ghế thành công", metadata: seats }).send(req, res);
  } catch (error) {
    return res.status(500).json({
      status: "error",
      code: 500,
      message: error.message,
    });
  }
};

const getSeatStatusController = async (req, res) => {
  try {
    const { routeId, seatId } = req.query;

    if (!routeId || !seatId) {
      throw new NotFoundError("Thiếu thông tin để lấy ghế");
    }

    const seatStatus = await seatService.getSeatStatus(routeId, seatId);

    return new OK({ message: "Lấy trạng thái ghế thành công", metadata: seatStatus }).send(req, res);
  } catch (error) {
    return res.status(500).json({
      status: "error",
      code: 500,
      message: error.message,
    });
  }
};

const createTicketController = async (req, res) => {
  try {
    const { routeId, seatIds, userId, from, to, price } = req.body;

    if (!routeId || !seatIds?.length || !userId || !from || !to || !price) {
      throw new NotFoundError("Thiếu thông tin để tạo vé");
    }

    const ticket = await seatService.createTicket(routeId, seatIds, userId, from, to, price);

    return new OK({ message: "Tạo vé thành công", metadata: ticket }).send(req, res);
  } catch (error) {
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
