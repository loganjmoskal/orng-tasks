import React, {useState, useEffect} from "react"; 
import axios from "axios";
import { Link } from "react-router-dom";
import './App.css';

// Your backend API's URL
const API_URL = "http://localhost:5000/tasks";

function TaskList({showCompleted}) {
  // state variables
  // 'tasks' holds the list of tasks from the DB
  const [tasks, setTasks] = useState([]); 
  // 'newTaskTitle' holds the text in the input box
  const [newTaskTitle, setNewTaskTitle] = useState("");

  // load tasks from the backend when the app starts
  // The empty array [] means this runs once when the app loads
  useEffect(() => {
    loadTasks();
  }, []);

  // function to load tasks from the backend
  const loadTasks = async () => {
    try {
      // Use axios to make a GET request
      const response = await axios.get(API_URL);
      setTasks(response.data); // Update our state with the tasks
    } catch (err) {
      console.error("Error loading tasks:", err);
    }
  };

  // function to handle adding a new task
  const handleAddTask = async (e) => {
    // Prevent the form from refreshing the page
    e.preventDefault(); 
    if (!newTaskTitle) return; // Don't add empty tasks

    try {
      // Send the new task title to the API
      const response = await axios.post(API_URL, { title: newTaskTitle });
      
      // Add the new task (from the DB) to our state
      setTasks([...tasks, response.data]);
      setNewTaskTitle(""); // Clear the input box
    } catch (err) {
      console.error("Error adding task:", err);
    }
  };

  const handleToggleComplete = async (taskToUpdate) => {
    try {
      // Send a request to update the task
      const response = await axios.put(`${API_URL}/${taskToUpdate._id}`);

      // Update the task in our state
      setTasks(tasks.map(task => 
        task._id === taskToUpdate._id ? response.data : task
      ));
    } catch (err) {
      console.error("Error updating task:", err);
    }
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
            <span>{task.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TaskList
