const express = require('express');
const router = express.Router();

const homeRoutes = require('./homeRoutes');

router.use('/home', homeRoutes);

module.exports = router;