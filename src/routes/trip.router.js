const express = require("express");
const controller = require("../controller/trip.controller");

const router = express.Router();
const asyncHandler = require("express-async-handler");

// Define ticket routes
// router.get("/", asyncHandler(controller.));
router.get("/:id", asyncHandler(controller.getTripByIdController));
router.post("/", asyncHandler(controller.createTripController));
router.delete("/:id", asyncHandler(controller.deleteTripController));
// router.get("/sold-this-month", asyncHandler(controller.getSoldTicketsThisMonth));

module.exports = router;
