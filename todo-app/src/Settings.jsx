import React from 'react';
import { Link } from 'react-router-dom';

function Settings({ showCompleted, setShowCompleted }) {

  const handleToggle = () => {
    setShowCompleted(!showCompleted);
  };

  return (
    <div>
      <h1>Settings</h1>
      
      <div className="setting-item">
        <label htmlFor="show-completed">Show Completed Tasks</label>
        <input
          type="checkbox"
          id="show-completed"
          checked={showCompleted}
          onChange={handleToggle}
        />
      </div>

      <br />
      <Link to="/">Back to Tasks</Link>
    </div>
  );
}

export default Settings;