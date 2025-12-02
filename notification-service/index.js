
const express = require('express');
const cors = require('cors');
const schedule = require('node-schedule');

const app = express();
app.use(cors());
app.use(express.json());

const jobs = {};

app.post('/schedule', (req, res) => {
    const { taskId, taskTitle, dueTime } = req.body;

    if (!taskId || !dueTime) {
        return res.status(400).json({ error: "Missing taskId or dueTime" });
    }

    const date = new Date(dueTime);

    // schdule the notification
    const job = schedule.scheduleJob(date, function(){
        console.log("------------------------------------------------");
        console.log(`NOTIFICATION ALERT: Task "${taskTitle}" is due now!`);
        console.log("------------------------------------------------");
    });

    jobs[taskId] = job;

    console.log(`Notification scheduled for task "${taskTitle}" at ${date}`);
    res.json({ message: "Notification scheduled successfully", time: date });
});

const PORT = 5003;
app.listen(PORT, () => console.log(`Notification Service running on port ${PORT}`));