const express = require('express');
const router = express.Router();
const authMiddleWare = require('../middleware/authMiddleware')
const profile = require('../controllers/profileController');

router.get('/profile',authMiddleWare.authMiddleware,profile.getProfile);

module.exports = router;