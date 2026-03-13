const express = require('express');
const router = express.Router();


const logUser = require('../controllers/logController');
const authMiddleWare = require('../middleware/authMiddleware');
router.post("/register",logUser.registerUser);
router.post("/login",logUser.loginUser);
router.delete('/delete-account',authMiddleWare.authMiddleware,logUser.deleteAccount);


module.exports = router;