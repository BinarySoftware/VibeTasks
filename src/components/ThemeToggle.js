import React from 'react';
import './ThemeToggle.css';

function ThemeToggle({ isDarkMode, toggleTheme }) {
  return (
    <div className="theme-toggle-container">
      <label className="theme-toggle">
        <input 
          type="checkbox" 
          checked={isDarkMode}
          onChange={toggleTheme}
        />
        <div className="slider">
          <div className="slider-icon">
            {isDarkMode ? '🌙' : '☀️'}
          </div>
        </div>
      </label>
    </div>
  );
}

export default ThemeToggle; 