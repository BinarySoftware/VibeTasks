import React, { useState, useEffect, useCallback } from 'react';
import './TaskStreaks.css';

const TaskStreaks = ({ todos }) => {
  const [streak, setStreak] = useState(() => {
    const savedStreak = localStorage.getItem('vibe-todo-streak');
    return savedStreak ? JSON.parse(savedStreak) : {
      current: 0,
      best: 0,
      lastUpdate: null,
      completedToday: false
    };
  });
  
  const [showStreak, setShowStreak] = useState(false);
  const [streakAnimation, setStreakAnimation] = useState(false);
  
  // Calculate streak level - wrapped in useCallback for consistency
  // Using the full streak object as dependency since we reference streak.current
  const getStreakLevel = useCallback(() => {
    if (streak.current === 0) return 'none';
    if (streak.current < 3) return 'starting';
    if (streak.current < 7) return 'good';
    if (streak.current < 14) return 'great';
    if (streak.current < 30) return 'amazing';
    return 'legendary';
  }, [streak]); // Using full streak object as dependency
  
  // Get emoji based on streak level
  const getStreakEmoji = useCallback(() => {
    const level = getStreakLevel();
    switch (level) {
      case 'none': return '😊';
      case 'starting': return '🔥';
      case 'good': return '🔥🔥';
      case 'great': return '🔥🔥🔥';
      case 'amazing': return '⚡🔥⚡';
      case 'legendary': return '👑🔥👑';
      default: return '🔥';
    }
  }, [getStreakLevel]);
  
  // Get motivational message based on streak
  const getStreakMessage = useCallback(() => {
    const level = getStreakLevel();
    switch (level) {
      case 'none': 
        return "Complete a task today to start your streak!";
      case 'starting': 
        return `${streak.current} day streak! You're on your way!`;
      case 'good': 
        return `${streak.current} day streak! You're building momentum!`;
      case 'great': 
        return `${streak.current} day streak! You're on fire!`;
      case 'amazing': 
        return `${streak.current} day streak! Absolutely incredible!`;
      case 'legendary': 
        return `${streak.current} day streak! You're legendary!`;
      default: 
        return `${streak.current} day streak!`;
    }
  }, [getStreakLevel, streak]); // Using full streak object as dependency
  
  // Update streak information
  useEffect(() => {
    if (!todos || todos.length === 0) return;
    
    const today = new Date().toDateString();
    const lastUpdate = streak.lastUpdate ? new Date(streak.lastUpdate).toDateString() : null;
    
    // Check if any task was completed today
    const completedTodayCount = todos.filter(todo => {
      if (!todo.completed) return false;
      
      // If completion date exists, use it, otherwise use today
      const completionDate = todo.completedAt 
        ? new Date(todo.completedAt).toDateString() 
        : today;
        
      return completionDate === today;
    }).length;
    
    const completedToday = completedTodayCount > 0;
    
    // If we've completed a task today and haven't already recorded it
    if (completedToday && !streak.completedToday) {
      let newStreak = { ...streak, completedToday: true, lastUpdate: new Date().toISOString() };
      
      // Check if it's a new day since the last update
      if (lastUpdate !== today) {
        // If the last update was yesterday, increase streak
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayString = yesterday.toDateString();
        
        if (lastUpdate === yesterdayString || streak.current === 0) {
          // Increment streak
          newStreak.current += 1;
          
          // Update best streak if current is better
          if (newStreak.current > newStreak.best) {
            newStreak.best = newStreak.current;
          }
          
          // Trigger animation
          setStreakAnimation(true);
          setTimeout(() => setStreakAnimation(false), 2000);
        } 
        // If we missed a day, reset streak but count today
        else if (lastUpdate !== null) {
          newStreak.current = 1;
        }
      }
      
      setStreak(newStreak);
      localStorage.setItem('vibe-todo-streak', JSON.stringify(newStreak));
    }
    // If no tasks completed today, but we're on a new day, reset completedToday flag
    else if (lastUpdate !== today && streak.completedToday) {
      const newStreak = { ...streak, completedToday: false, lastUpdate: new Date().toISOString() };
      setStreak(newStreak);
      localStorage.setItem('vibe-todo-streak', JSON.stringify(newStreak));
    }
  }, [todos, streak]);
  
  return (
    <div className="task-streaks">
      <button 
        className={`streak-button ${getStreakLevel()} ${streakAnimation ? 'animate' : ''}`}
        onClick={() => setShowStreak(!showStreak)}
      >
        <span className="streak-emoji">{getStreakEmoji()}</span>
        <span className="streak-count">{streak.current}</span>
      </button>
      
      {showStreak && (
        <div className="streak-panel">
          <h3 className="streak-title">Your Task Streak</h3>
          
          <div className="streak-meter">
            <div className={`streak-meter-fill ${getStreakLevel()}`} style={{ width: `${Math.min(100, (streak.current / 30) * 100)}%` }}></div>
          </div>
          
          <div className="streak-info">
            <div className="streak-message">
              {getStreakMessage()}
            </div>
            
            <div className="streak-stats">
              <div className="streak-stat">
                <span className="stat-label">Current Streak</span>
                <span className="stat-value">{streak.current} days</span>
              </div>
              <div className="streak-stat">
                <span className="stat-label">Best Streak</span>
                <span className="stat-value">{streak.best} days</span>
              </div>
            </div>
            
            <div className="streak-tip">
              <span className="tip-icon">💡</span>
              <span className="tip-text">Complete at least one task daily to maintain your streak!</span>
            </div>
          </div>
          
          <button 
            className="close-streak"
            onClick={() => setShowStreak(false)}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default TaskStreaks; 