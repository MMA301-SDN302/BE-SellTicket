const express = require("express");
const router = express.Router();
const { getHomepageData } = require("../controllers/homeController");

router.get("/", getHomepageData);

module.exports = router;
