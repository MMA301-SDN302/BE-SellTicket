const express = require("express");
const router = express.Router();

router.use("/auth", require("./auth.router"));
router.use("/locations", require("./locationRoutes"));

module.exports = router;
