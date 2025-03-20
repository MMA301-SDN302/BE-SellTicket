const express = require("express");
const  controller = require("../controller/location.controller.js");

const router = express.Router();
const asyncHandler = require("express-async-handler");
// Define location routes
router.get("/", asyncHandler(controller.getAllLocations));
router.get("/:_id",asyncHandler(controller.getLocationById));
router.post("/", asyncHandler(controller.createLocation));
router.put("/:_id", asyncHandler(controller.updateLocation));
router.delete("/:_id", asyncHandler(controller.deleteLocation));

module.exports = router;