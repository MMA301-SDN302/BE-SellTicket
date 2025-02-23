const express = require("express");
const controller = require("../controller/route.controler.js");

const router = express.Router();
const asyncHandler = require("express-async-handler");

// Define route endpoints
router.get("/", asyncHandler(controller.getAllRoutes));
router.get("/search", asyncHandler(controller.getSearchRoutes));
router.get("/:id", asyncHandler(controller.getRouteById));
router.post("/", asyncHandler(controller.createRoute));
router.put("/:id", asyncHandler(controller.updateRoute));
router.delete("/:id", asyncHandler(controller.deleteRoute));

module.exports = router;
