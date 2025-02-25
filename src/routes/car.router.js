const express = require("express");
const controller = require("../controller/car.controller.js");

const router = express.Router();
const asyncHandler = require("express-async-handler");

// Define car routes
router.get("/", asyncHandler(controller.getAllCars));
router.get("/:_id", asyncHandler(controller.getCarById));
router.post("/", asyncHandler(controller.createCar));
router.put("/:_id", asyncHandler(controller.updateCar));
router.delete("/:_id", asyncHandler(controller.deleteCar));

module.exports = router;
