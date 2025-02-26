const express = require("express");
const controller = require("../controller/busCompany.controller.js");

const router = express.Router();
const asyncHandler = require("express-async-handler");

// Define bus company routes
router.get("/", asyncHandler(controller.getAllBusCompanies));
router.get("/:_id", asyncHandler(controller.getBusCompanyById));
router.post("/", asyncHandler(controller.createBusCompany));
router.put("/:_id", asyncHandler(controller.updateBusCompany));
router.delete("/:_id", asyncHandler(controller.deleteBusCompany));

module.exports = router;
