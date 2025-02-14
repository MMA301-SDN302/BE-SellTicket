const express = require("express");
const controller = require("../controller/ticket.controller.js");

const router = express.Router();
const asyncHandler = require("express-async-handler");

// Define ticket routes
router.get("/", asyncHandler(controller.getAllTickets));
router.get("/:id", asyncHandler(controller.getTicketById));
router.post("/", asyncHandler(controller.createTicket));
router.delete("/:id", asyncHandler(controller.cancelTicket));

module.exports = router;
