import React, { useEffect } from 'react';
import './PomodoroTimer.css';
import { usePomodoro } from '../contexts/PomodoroContext';

function PomodoroTimer() {
  const {
    mode,
    setMode,
    timeLeft,
    isActive,
    completedPomodoros,
    toggleTimer,
    resetTimer,
    formatTime,
    calculateProgress,
    calculateEndTime,
    requestNotificationPermission
  } = usePomodoro();
  
  // Request notification permission when component mounts
  useEffect(() => {
    requestNotificationPermission();
  }, [requestNotificationPermission]);
  
  return (
    <div className={`pomodoro-container ${mode}`}>
      <div className="tab-container">
        <button 
          className={`tab-button ${mode === 'pomodoro' ? 'active' : ''}`} 
          onClick={() => { setMode('pomodoro'); }}
        >
          Pomodoro
        </button>
        <button 
          className={`tab-button ${mode === 'shortBreak' ? 'active' : ''}`} 
          onClick={() => { setMode('shortBreak'); }}
        >
          Short Break
        </button>
        <button 
          className={`tab-button ${mode === 'longBreak' ? 'active' : ''}`} 
          onClick={() => { setMode('longBreak'); }}
        >
          Long Break
        </button>
      </div>
      
      <div className="timer-display">
        <div className="time-remaining">{formatTime(timeLeft)}</div>
        <div className="progress-bar">
          <div 
            className="progress-indicator"
            style={{ width: `${calculateProgress()}%` }}
          ></div>
        </div>
        {isActive && <div className="end-time">{calculateEndTime()}</div>}
      </div>
      
      <div className="timer-controls">
        <button 
          className={`control-button ${isActive ? 'pause' : 'start'}`} 
          onClick={toggleTimer}
        >
          {isActive ? 'Pause' : 'Start'}
        </button>
        <button 
          className="control-button reset" 
          onClick={resetTimer}
        >
          Reset
        </button>
      </div>
      
      <div className="pomodoro-stats">
        <span className="pomodoro-count">
          {completedPomodoros} {completedPomodoros === 1 ? 'pomodoro' : 'pomodoros'} today
        </span>
        {isActive && <span className="timer-status">Timer running in background</span>}
      </div>
    </div>
  );
}

export default PomodoroTimer; 