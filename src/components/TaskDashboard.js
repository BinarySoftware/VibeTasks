import React, { useState, useEffect, useMemo } from 'react';
import './TaskDashboard.css';

function TaskDashboard({ todos }) {
  const [stats, setStats] = useState({
    completed: 0,
    active: 0,
    highPriority: 0,
    mediumPriority: 0,
    lowPriority: 0,
    completionRate: 0,
    streakDays: 0
  });

  // Memoize the productivity tip so it doesn't change on every render
  const randomTip = useMemo(() => getRandomTip(), []);

  useEffect(() => {
    const completed = todos.filter(todo => todo.completed).length;
    const active = todos.filter(todo => !todo.completed).length;
    const highPriority = todos.filter(todo => todo.priority === 'high').length;
    const mediumPriority = todos.filter(todo => todo.priority === 'medium').length;
    const lowPriority = todos.filter(todo => todo.priority === 'low').length;
    
    const completionRate = todos.length > 0 ? Math.round((completed / todos.length) * 100) : 0;
    
    // Calculate streak days (consecutive days with completed tasks)
    const streakDays = calculateStreakDays(todos);
    
    setStats({
      completed,
      active,
      highPriority,
      mediumPriority,
      lowPriority,
      completionRate,
      streakDays
    });
  }, [todos]);
  
  const calculateStreakDays = (todos) => {
    // Get completed tasks sorted by date
    const completedTasks = todos
      .filter(todo => todo.completed && todo.completedAt)
      .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
    
    if (completedTasks.length === 0) return 0;
    
    // Check if there's a task completed today
    const today = new Date().setHours(0, 0, 0, 0);
    const latestCompletionDate = new Date(completedTasks[0].completedAt).setHours(0, 0, 0, 0);
    
    if (today !== latestCompletionDate) return 0;
    
    // Count consecutive days
    let streak = 1;
    let currentDay = today;
    
    for (let i = 1; i < completedTasks.length; i++) {
      const completionDate = new Date(completedTasks[i].completedAt).setHours(0, 0, 0, 0);
      const previousDay = currentDay - 86400000; // Subtract one day in milliseconds
      
      if (completionDate === previousDay) {
        streak++;
        currentDay = previousDay;
      } else if (completionDate < previousDay) {
        break;
      }
    }
    
    return streak;
  };

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Your Productivity Dashboard</h2>
      
      <div className="stats-grid">
        <div className="stat-card completion-rate">
          <div className="stat-circle" style={{ background: `conic-gradient(var(--primary-color) ${stats.completionRate}%, var(--border-color) 0)` }}>
            <span className="stat-value">{stats.completionRate}%</span>
          </div>
          <span className="stat-label">Completion Rate</span>
        </div>
        
        <div className="stat-card streak">
          <div className="stat-value">
            <span className="large-number">{stats.streakDays}</span>
            <span className="fire-emoji">🔥</span>
          </div>
          <span className="stat-label">Day Streak</span>
        </div>
        
        <div className="stat-card tasks-count">
          <div className="split-stat">
            <div className="stat-item">
              <span className="stat-value active-count">{stats.active}</span>
              <span className="stat-label">Active</span>
            </div>
            <div className="stat-item">
              <span className="stat-value completed-count">{stats.completed}</span>
              <span className="stat-label">Completed</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="priority-distribution">
        <h3 className="section-title">Priority Distribution</h3>
        <div className="priority-bars">
          <div className="priority-bar-container">
            <div 
              className="priority-bar high-priority"
              style={{ width: `${todos.length > 0 ? (stats.highPriority / todos.length) * 100 : 0}%` }}
            ></div>
            <span className="priority-label">High ({stats.highPriority})</span>
          </div>
          <div className="priority-bar-container">
            <div 
              className="priority-bar medium-priority"
              style={{ width: `${todos.length > 0 ? (stats.mediumPriority / todos.length) * 100 : 0}%` }}
            ></div>
            <span className="priority-label">Medium ({stats.mediumPriority})</span>
          </div>
          <div className="priority-bar-container">
            <div 
              className="priority-bar low-priority"
              style={{ width: `${todos.length > 0 ? (stats.lowPriority / todos.length) * 100 : 0}%` }}
            ></div>
            <span className="priority-label">Low ({stats.lowPriority})</span>
          </div>
        </div>
      </div>
      
      <div className="productivity-tips">
        <h3 className="section-title">Productivity Tips</h3>
        <div className="tip-card">
          <p>{randomTip}</p>
        </div>
      </div>
    </div>
  );
}

function getRandomTip() {
  const tips = [
    "Break big tasks into smaller ones to make progress more manageable.",
    "Try the Pomodoro Technique: 25 minutes of focus followed by a 5-minute break.",
    "Complete your most important task first thing in the morning.",
    "Set specific, measurable goals instead of vague objectives.",
    "Take short breaks to maintain focus and prevent burnout.",
    "Review your tasks at the end of the day and plan for tomorrow.",
    "Use the 2-minute rule: If a task takes less than 2 minutes, do it now.",
    "Group similar tasks together to minimize context switching.",
    "Track your progress to stay motivated and see how far you've come.",
    "Remember to celebrate your accomplishments, no matter how small!"
  ];
  
  return tips[Math.floor(Math.random() * tips.length)];
}

export default TaskDashboard; 