import React, {useState, useEffect} from "react"; 
import axios from "axios";
import { Link } from "react-router-dom";
import './App.css';

const API_URL = "http://localhost:5000/tasks";

function TaskList({showCompleted}) {
  // --- STATE VARIABLES ---
  const [tasks, setTasks] = useState([]); 
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingTaskTitle, setEditingTaskTitle] = useState("");

  const [selectedFile, setSelectedFile] = useState(null);

  const [currentTime, setCurrentTime] = useState("Loading time...");

  const [selectedDate, setSelectedDate] = useState("");

  const [priority, setPriority] = useState("Medium");

  const [currentList, setCurrentList] = useState("Main");
  const [lists, setLists] = useState(["Main", "Work", "Personal"]);

  // --- LOAD TASKS ON MOUNT & LIST CHANGE ---
  useEffect(() => {
    loadTasks();
    loadTime();

    const timer = setInterval(() => {
      loadTime();
    }, 60000); // update time every minute

    return () => clearInterval(timer);
  }, [currentList]);


  // --- GLOBAL NOTIFICATION LISTENER ---
  useEffect(() => {
    const checkAllDueDates = async () => {
      try {
        // fetch all tasks from the backend
        const response = await axios.get(`${API_URL}?all=true`);
        const allTasks = response.data;
        
        const now = new Date();

        allTasks.forEach(task => {
          // check active tasks with due dates
          if (!task.completed && task.dueDate) {
            const due = new Date(task.dueDate);
            const timeDiff = due - now;

            // check if due within the last/next 10 seconds
            if (Math.abs(timeDiff) < 10000) { 
               alert(`REMINDER: "${task.title}" (List: ${task.listName}) is due!`);
            }
          }
        });
      } catch (err) {
        console.error("Background check failed:", err);
      }
    };

    // run this check every 10 seconds
    const interval = setInterval(checkAllDueDates, 10000);

    return () => clearInterval(interval);
  }, []);


  // function to load tasks from the backend
  const loadTasks = async () => {
    try {
      const response = await axios.get(`${API_URL}?list=${currentList}`);
      setTasks(response.data);
    } catch (err) {
      console.error("Error loading tasks:", err);
    }
  };


  // function to handle adding a new task
  const handleAddTask = async (e) => {
    e.preventDefault(); 
    if (!newTaskTitle) return;

    let attachmentURL = "";

    // if a file is selected, upload it first
    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);

      try {
        const uploadResponse = await axios.post("http://localhost:5001/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        attachmentURL = uploadResponse.data.url;
      } catch (err) {
        console.error("File upload failed:", err);
        alert("Failed to upload file. Task will be created without it.");
      }
    }

    // create the task
    try {
      const response = await axios.post(API_URL, {
        title: newTaskTitle,
        attachment: attachmentURL,
        dueDate: selectedDate,
        priority: priority,
        listName: currentList
      });

      const createdTask = response.data;

      // schedule notification if due date is set
      if (selectedDate) {
        try {
          await axios.post("http://localhost:5003/schedule", {
            taskId: createdTask._id,
            taskTitle: createdTask.title,
            dueTime: selectedDate,
          });
          console.log("Notification scheduled!");
        } catch (notifErr) {
          console.error("Failed to schedule notification:", notifErr);
        }
      }
      
      // add the new task to our state
      setTasks([...tasks, response.data]);
      setNewTaskTitle("");
      setSelectedFile(null);
      setSelectedDate("");
      setPriority("Medium");


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


  // function for editing tasks
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


  // function to load current time from microservice
  const loadTime = async () => {
  try {
    const response = await axios.get("http://localhost:5000/time");
    setCurrentTime(response.data.time);
  } catch (err) {
    console.error("Error loading time:", err);
    setCurrentTime("Error loading time");
    }
  };


  // function to handle sorting tasks
  const handleSort = async (order) => {
    try {
      const response = await axios.post("http://localhost:5002/sort", {
        tasks: tasks, 
        sortBy: order
      });
      setTasks(response.data); 
    } catch (err) {
      console.error("Sorting error:", err);
    }
  };
  

  // Filter tasks based on showCompleted prop
  const filteredTasks = tasks.filter(task => 
    showCompleted || !task.completed
  );

  // --- UI ---
  return (
    <div className="App">
      <header className="app-header">
        <div className="header-title">
            <h1>ORNG Tasks</h1>
            <span>{currentTime}</span> 
        </div>
        <Link to="/settings" className="icon-btn">⚙️</Link>
      </header>

      <div className="list-tabs">
        {lists.map(list => (
          <button key={list} onClick={() => setCurrentList(list)}>{list}</button>
        ))}
        <button 
            className="add-list-btn"
            onClick={() => {
                const newName = prompt("Enter new list name:");
                if(newName) { setLists([...lists, newName]); setCurrentList(newName); }
            }}
        >+</button>
      </div>

      <div className="task-form-container">
        <form onSubmit={handleAddTask} className="task-form">
            <input
              type="text"
              className="task-input-text"
              placeholder="Click to Add Task..."
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
            />
            
            <select 
                className="task-input-select"
                value={priority}
                onChange={(e) => setPriority(e.target.value)} 
            >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
            </select>

            <label className="task-attach-label" title="Attach File">
                📎
                <input 
                    type="file" 
                    onChange={(e) => setSelectedFile(e.target.files[0])} 
                    style={{display: 'none'}} 
                />
            </label>
            {selectedFile && <span className="file-selected-dot">•</span>}
            
            <input 
                type="datetime-local" 
                className="task-input-date"
                value={selectedDate} 
                onChange={(e) => setSelectedDate(e.target.value)} 
            />

            <button type="submit" className="add-btn">＋</button>
        </form>
      </div>

      <div className="list-headers">
        <span className="sort-header" onClick={() => handleSort('title_asc')}>Title ⇅</span>
        <span className="sort-header" onClick={() => handleSort('priority')}>Priority ⇅</span>
      </div>
        
      <div className="task-list">
        {filteredTasks.map(task => (
          <div key={task._id} className={`task-item ${task.completed ? 'completed' : ''}`}>
            
            <div className="task-content">
                {editingTaskId === task._id ? (
                    <>
                    <input 
                        type="text" 
                        className="edit-mode-input"
                        value={editingTaskTitle} 
                        onChange={(e) => setEditingTaskTitle(e.target.value)} 
                    />
                    <button className="edit-mode-btn" onClick={() => saveEdit(task._id)}>💾</button>
                    <button className="edit-mode-btn" onClick={() => setEditingTaskId(null)}>❌</button>
                    </>
                ) : (
                    <div className="task-info">
                        <span className="task-title">{task.title}</span>
                        <div className="task-meta-row">
                            {task.dueDate && (
                                <div className="meta-date">
                                    📅 {new Date(task.dueDate).toLocaleString()}
                                </div>
                            )}
                            {task.attachment && (
                                <a href={task.attachment} target="_blank" rel="noreferrer" className="meta-attachment">
                                    📎 Attachment
                                </a>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <div className="task-meta-group">
                <span className={`priority-badge priority-${(task.priority || "Medium").toLowerCase()}`}>
                    {task.priority || "Medium"}
                </span>

                <div className="action-buttons">
                   <button onClick={() => startEditing(task)}>✏️</button>
                   <button onClick={() => handleDeleteTask(task._id)}>🗑️</button>
                </div>

                <input
                  type="checkbox"
                  className="circle-checkbox"
                  checked={task.completed}
                  onChange={() => handleToggleComplete(task)}
                />
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}

export default TaskList
