const express = require("express");
const controller = require("../controller/route.controler.js");

const router = express.Router();
const asyncHandler = require("express-async-handler");

// Define route endpoints
router.get("/", asyncHandler(controller.getAllRoutes));
router.get("/search", asyncHandler(controller.getSearchRoutes));
router.get("/:_id", asyncHandler(controller.getRouteById));
router.get("/supportSearch", asyncHandler(controller.getLocationName));
router.post("/", asyncHandler(controller.createRoute));
router.put("/:_id", asyncHandler(controller.updateRoute));
router.delete("/:_id", asyncHandler(controller.deleteRoute));

router.get("/statistics", asyncHandler(controller.getTripStatistics));

module.exports = router;
