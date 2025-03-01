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

module.exports = {
  getCarSeatController,
};
