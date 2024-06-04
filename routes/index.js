const express = require('express');
const router = express.Router();

const taskRoute = require('./taskRoute');

router.use('/task', taskRoute)

module.exports = router;
