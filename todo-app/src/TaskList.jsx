import React, {useState, useEffect} from "react"; 
import axios from "axios";
import { Link } from "react-router-dom";
import './App.css';

// Your backend API's URL
const API_URL = "http://localhost:5000/tasks";

function TaskList({showCompleted}) {
  // state variables
  const [tasks, setTasks] = useState([]); 
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingTaskTitle, setEditingTaskTitle] = useState("");

  // load tasks from the backend when the app starts
  useEffect(() => {
    loadTasks();
  }, []);

  // function to load tasks from the backend
  const loadTasks = async () => {
    try {
      const response = await axios.get(API_URL);
      setTasks(response.data); // update our state with the tasks
    } catch (err) {
      console.error("Error loading tasks:", err);
    }
  };

  // function to handle adding a new task
  const handleAddTask = async (e) => {
    e.preventDefault(); 
    if (!newTaskTitle) return;

    try {
      // send the new task title to the API
      const response = await axios.post(API_URL, { title: newTaskTitle });
      
      // add the new task (from the DB) to our state
      setTasks([...tasks, response.data]);
      setNewTaskTitle("");
    } catch (err) {
      console.error("Error adding task:", err);
    }
  };

  // function to handle toggling a tasks completed status
  const handleToggleComplete = async (taskToUpdate) => {
    try {
      // send a request to update the task
      const response = await axios.put(`${API_URL}/${taskToUpdate._id}`, { 
        completed: !taskToUpdate.completed 
      });

      // update the task in our state
      setTasks(tasks.map(task => 
        task._id === taskToUpdate._id ? response.data : task
      ));
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

  // function to handle deleting a task
  const handleDeleteTask = async (id) => {
    if(!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTasks(tasks.filter(t => t._id !== id));
    } catch (err) { console.error("Error deleting task:", err); }
  };

  // functions for editing tasks
  const startEditing = (task) => {
    setEditingTaskId(task._id);
    setEditingTaskTitle(task.title);
  };

  const saveEdit = async (id) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, { title: editingTaskTitle });
      setTasks(tasks.map(t => t._id === id ? response.data : t));
      setEditingTaskId(null);
    } catch (err) { console.error("Error saving edit:", err); }
  };

  
  // Filter tasks based on showCompleted prop
  const filteredTasks = tasks.filter(task => 
    showCompleted || !task.completed
  );

  // The main UI
  return (
    <div>
      <h1>My Orng Tasks</h1>
      
      <Link to="/settings">Go to Settings</Link>

      <form onSubmit={handleAddTask} className="task-form">
        <input
          type="text"
          placeholder="Enter a new task..."
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
        />
        <button type="submit">Add Task</button>
      </form>

      <div className="task-list">
        {filteredTasks.map(task => (
          <div
            key={task._id}
            className={`task-item ${task.completed ? 'completed' : ''}`}
          >
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => handleToggleComplete(task)}
            />

            {editingTaskId === task._id ? (
              <>
                <input
                  type="text"
                  value={editingTaskTitle}
                  onChange={(e) => setEditingTaskTitle(e.target.value)}
                />

                <button onClick={() => saveEdit(task._id)}>Save</button>
                <button onClick={() => setEditingTaskId(null)}>Cancel</button>
              </>
            ) : (
              <>
                <span>{task.title}</span>
                <button onClick={() => startEditing(task)}>Edit</button>
                <button onClick={() => handleDeleteTask(task._id)}>Delete</button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default TaskList
