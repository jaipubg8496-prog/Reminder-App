const express = require('express');
const router = express.Router();
const authMiddleWare = require('../middleware/authMiddleware')
const dashboard = require('../controllers/dashboardController');

router.get('/dashboard',authMiddleWare.authMiddleware,dashboard.getDashboard);

module.exports = router;