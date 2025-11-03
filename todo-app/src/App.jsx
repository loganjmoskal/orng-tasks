import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TaskList from './TaskList';
import Settings from './Settings';
import './App.css';

function App() {
  const [showCompleted, setShowCompleted] = useState(true);

  return (
    <BrowserRouter>
      <div className="App">
        <header className="App-header">
          <Routes>
            {/* Task List Page (at '/') */}
            <Route 
              path="/" 
              element={
                <TaskList showCompleted={showCompleted} />
              } 
            />
            
            {/* Settings Page (at '/settings') */}
            <Route 
              path="/settings" 
              element={
                <Settings 
                  showCompleted={showCompleted} 
                  setShowCompleted={setShowCompleted} 
                />
              } 
            />
          </Routes>
        </header>
      </div>
    </BrowserRouter>
  );
}

export default App;