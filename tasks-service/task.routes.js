const express = require('express');
const router = express.Router();

const taskController = require('./task.controller');

// GET /tasks - Get all tasks
router.get('/', taskController.getAllTasks);

// POST /tasks - Create a new task
router.post('/', taskController.createTask);

// PUT /tasks/:id - Update a task
router.put('/:id', taskController.updateTask);

// Export the router
module.exports = router;