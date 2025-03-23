const express = require("express");
const controller = require("../controller/seat.controller");

const router = express.Router();
const asyncHandler = require("express-async-handler");
const { authentication } = require("../auth");
router.get("/getSeat", asyncHandler(controller.getCarSeatController));
router.get("/checkSeat", asyncHandler(controller.getSeatStatusController));
router.use(authentication);
router.post("/createTicket", asyncHandler(controller.createTicketController));
module.exports = router;
