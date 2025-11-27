const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();


const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
const mongoURI = process.env.MONGO_URI;
mongoose.mongoose.connect(mongoURI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Import Microservices
const dateTimeController = require('./datetime.controller');

// Import task routes
const taskRoutes = require('./task.routes');
app.use('/tasks', taskRoutes);

// Microservice routes
app.get('/time', dateTimeController.getCurrentTime);

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
