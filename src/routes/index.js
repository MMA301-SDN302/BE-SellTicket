const express = require("express");
const router = express.Router();

router.use("/auth", require("./auth.router"));
router.use("/locations", require("./location.router"));
router.use("/cars", require("./car.router"))
router.use("/busCompany", require("./busCompany.router"))
router.use("/routes", require("./route.router"))
router.use("/tickets", require("./ticket.router"))
router.use("/trips", require("./trip.router"))
router.use("/profile", require("./user.router"))

module.exports = router;
