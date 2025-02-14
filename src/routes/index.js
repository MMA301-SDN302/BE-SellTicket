const express = require("express");
const router = express.Router();

router.use("/auth", require("./auth.router"));
router.use("/locations", require("./location.router"));
router.use("/cars", require("./car.router"))
router.use("/busCompany", require("./busCompany.router"))
router.use("/route", require("./route.router"))
router.use("/tickets", require("./ticket.router"))
module.exports = router;
