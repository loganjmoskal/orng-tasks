const Task = require('./task.model');


// Create a new task
exports.createTask = async (req, res) => {
    const task = new Task({
        title: req.body.title
    });

    try {
        const newTask = await task.save();
        res.status(201).json(newTask);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Read all tasks
exports.getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update a task
exports.updateTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: "Task not found" });

        if (req.body.title) task.title = req.body.title;
        if (req.body.completed !== undefined) task.completed = req.body.completed;

        const updatedTask = await task.save();
        res.json(updatedTask);
    } catch (err) {
        res.status(500).json({ error: err.message });  
    }
};

// Delete a task
exports.deleteTask = async (req, res) => {
    try {
        const result = await Task.findByIdAndDelete(req.params.id);
        if (!result) return res.status(404).json({ message: "Task not found" });
        res.json({ message: "Task deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};




