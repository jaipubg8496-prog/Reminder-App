const express = require('express');
const router = express.Router();
//DATABASE
const pool = require('../database/database');

//taskController
const taskController = require('../controllers/taskController')
const authMiddleWare = require('../middleware/authMiddleware')

//router
router.get('/tasks',authMiddleWare.authMiddleware,taskController.getTasks);
router.get('/tasks/:id',authMiddleWare.authMiddleware,taskController.getTasksById);
router.post('/tasks',authMiddleWare.authMiddleware,taskController.postTask);
router.put('/tasks/:id',authMiddleWare.authMiddleware,taskController.putTaskById);
router.delete('/tasks/:id',authMiddleWare.authMiddleware,taskController.deleteTaskById);

module.exports = router;