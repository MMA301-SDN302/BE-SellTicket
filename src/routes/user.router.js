const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const userController = require("../controller/user.controller");

router.put("/:_id", asyncHandler(userController.update));

module.exports = router;
