const express = require('express');
const router = express.Router();

const taskController = require('./task.controller');

router.post('/', taskController.createTask);
router.get('/', taskController.getAllTasks);
router.put('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

module.exports = router;