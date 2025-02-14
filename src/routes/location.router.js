const express = require("express");
const  controller = require("../controller/location.controller.js");

const router = express.Router();
const asyncHandler = require("express-async-handler");
// Define location routes
router.get("/", asyncHandler(controller.getAllLocations));
router.get("/:id",asyncHandler(controller.getLocationById));
router.post("/", asyncHandler(controller.createLocation));
router.put("/:id", asyncHandler(controller.updateLocation));
router.delete("/:id", asyncHandler(controller.deleteLocation));

module.exports = router;