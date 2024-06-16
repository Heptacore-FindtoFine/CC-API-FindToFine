const express = require('express');
const router = express.Router();

const taskRoute = require('./taskRoutes');
const userRoute = require('./userRoutes');

router.use('/task', taskRoute)
router.use('/user', userRoute)

module.exports = router;
