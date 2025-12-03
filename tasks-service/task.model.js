const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: String,
    completed: {type: Boolean, default: false},
    attachment: { type: String, default: ""},
    dueDate: { type: Date, default: null},
    priority: { type: String, default: "Medium"},
    listName: { type: String, default: "Main"}
});

module.exports = mongoose.model('Task', taskSchema);