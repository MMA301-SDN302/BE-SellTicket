const express = require("express");
const controller = require("../controller/seat.controller");

const router = express.Router();
const asyncHandler = require("express-async-handler");

router.get("/getSeat", asyncHandler(controller.getCarSeatController));

module.exports = router;

