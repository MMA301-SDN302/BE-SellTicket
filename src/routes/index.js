const express = require('express');
const router = express.Router();
locationRoutes = require("./locationRoutes.js");

const homeRoutes = require('./homeRoutes.js');

router.use('/home', homeRoutes);
router.use("/locations", locationRoutes);

module.exports = router;