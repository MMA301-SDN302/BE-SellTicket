const express = require("express");
const controller = require("../controller/ticket.controller.js");

const router = express.Router();
const asyncHandler = require("express-async-handler");
const { authentication } = require("../auth");
// Define ticket routes
router.get("/:_id", asyncHandler(controller.getTicketById));
router.post("/", asyncHandler(controller.createTicket));
router.delete("/:_id", asyncHandler(controller.cancelTicket));
router.get(
  "/sold-this-month",
  asyncHandler(controller.getSoldTicketsThisMonth)
);
router.use(authentication);
router.get("/", asyncHandler(controller.getAllTickets));
module.exports = router;
