import React from 'react';
import { Link } from 'react-router-dom';

function Settings({ showCompleted, setShowCompleted }) {

  return (
    <div className="App">
      
      {/* --- HEADER --- */}
      <header className="app-header">

        
        <div className="header-title">
            <h1>ORNG Tasks</h1>
        </div>

        <Link to="/" className="icon-btn" title="Back to Tasks">←</Link>
      </header>

      {/* --- MAIN CONTENT --- */}
      <div className="settings-container">
        
        <div className="settings-card">
            <h2>Preferences</h2>

            <label className="settings-label">
                <input 
                    type="checkbox" 
                    className="circle-checkbox" /* Reusing your existing checkbox style */
                    checked={showCompleted}
                    onChange={(e) => setShowCompleted(e.target.checked)}
                />
                Show Completed Tasks
            </label>


        </div>

      </div>
    </div>
  );
}

export default Settings;