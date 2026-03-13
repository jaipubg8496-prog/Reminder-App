const express = require('express');
const router = express.Router();

const reminderTask = require('../controllers/remindController')

router.get('/remind',reminderTask.getRemindTasks);

module.exports = router;