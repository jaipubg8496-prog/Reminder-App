const express = require('express');
const router = express.Router();

const progressTask = require('../controllers/progressTaskController')
const authMiddleWare = require('../middleware/authMiddleware')
router.post('/progress',authMiddleWare.authMiddleware,progressTask.moveToProgress);

module.exports = router;