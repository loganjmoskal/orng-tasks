const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json()); 


app.post('/filter', (req, res) => {
    const { tasks, filterBy } = req.body;
    
    if (!tasks || !Array.isArray(tasks)) {
        return res.status(400).json({ error: "Invalid task list" });
    }

    let filteredTasks = tasks;

    if (filterBy === 'active') {
        filteredTasks = tasks.filter(t => !t.completed);
    } else if (filterBy === 'completed') {
        filteredTasks = tasks.filter(t => t.completed);
    }

    res.json(filteredTasks);
});


app.post('/sort', (req, res) => {
    const { tasks, sortBy } = req.body;

    if (!tasks || !Array.isArray(tasks)) {
        return res.status(400).json({ error: "Invalid task list" });
    }

    let sortedTasks = [...tasks]; 

    if (sortBy === 'title_asc') {
        sortedTasks.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'title_desc') {
        sortedTasks.sort((a, b) => b.title.localeCompare(a.title));
    }
    // add date sorting here later 

    res.json(sortedTasks);
});

const PORT = 5002;
app.listen(PORT, () => console.log(`Sorting Service running on port ${PORT}`));