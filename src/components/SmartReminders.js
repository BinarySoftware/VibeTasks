import React, { useState, useEffect } from 'react';
import './SmartReminders.css';

const SmartReminders = ({ todos }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showReminders, setShowReminders] = useState(false);
  
  // Generate task suggestions based on priority and status
  useEffect(() => {
    if (!todos || todos.length === 0) return;
    
    // Filter for incomplete tasks
    const incompleteTasks = todos.filter(todo => !todo.completed);
    if (incompleteTasks.length === 0) return;
    
    // Sort tasks by priority (high > medium > low)
    const priorityValue = { high: 3, medium: 2, low: 1 };
    const sortedTasks = [...incompleteTasks].sort((a, b) => 
      priorityValue[b.priority || 'medium'] - priorityValue[a.priority || 'medium']
    );
    
    // Get top 3 tasks that should be focused on
    const topTasks = sortedTasks.slice(0, 3);
    
    // Generate smart suggestions
    const newSuggestions = topTasks.map(task => {
      const timeOfDay = getOptimalTimeOfDay(task.priority);
      return {
        id: task.id,
        text: task.text,
        priority: task.priority || 'medium',
        timeOfDay: timeOfDay,
        emoji: getEmoji(task.priority, timeOfDay)
      };
    });
    
    setSuggestions(newSuggestions);
  }, [todos]);
  
  // Helper function to determine optimal time of day based on priority
  const getOptimalTimeOfDay = (priority) => {
    const currentHour = new Date().getHours();
    
    // For high priority tasks, suggest as soon as possible
    if (priority === 'high') {
      return currentHour < 12 ? 'morning' : 
             currentHour < 17 ? 'afternoon' : 'evening';
    }
    
    // For medium priority tasks, suggest time of day based on productivity peaks
    if (priority === 'medium') {
      return currentHour < 10 ? 'morning' : 
             currentHour < 15 ? 'afternoon' : 'evening';
    }
    
    // For low priority tasks, suggest evening or free time
    return 'evening';
  };
  
  // Helper function to get emoji for suggestion
  const getEmoji = (priority, timeOfDay) => {
    if (priority === 'high') {
      return '🔥'; // Fire for high priority
    }
    
    // Time of day emojis
    if (timeOfDay === 'morning') return '☀️';
    if (timeOfDay === 'afternoon') return '🌤️';
    return '🌙'; // Evening
  };
  
  // Get friendly message for time of day
  const getTimeMessage = (timeOfDay) => {
    switch (timeOfDay) {
      case 'morning':
        return 'Try completing this in the morning when your energy is high!';
      case 'afternoon':
        return 'Afternoon is a good time to tackle this task!';
      case 'evening':
        return 'Evening might be perfect for this task when you have some quiet time.';
      default:
        return 'Find some time today to complete this task!';
    }
  };
  
  return (
    <div className="smart-reminders">
      <button 
        className="reminders-button"
        onClick={() => setShowReminders(!showReminders)}
      >
        <span className="reminders-icon">💡</span>
        <span className="reminders-text">Smart Suggestions</span>
      </button>
      
      {showReminders && suggestions.length > 0 && (
        <div className="reminders-panel">
          <h3 className="reminders-title">Your Personalized Task Plan</h3>
          <div className="reminders-description">
            Here are smart suggestions to help you manage your tasks effectively.
          </div>
          
          <div className="suggestion-list">
            {suggestions.map(suggestion => (
              <div 
                key={suggestion.id} 
                className={`suggestion-item ${suggestion.priority}`}
              >
                <div className="suggestion-emoji">{suggestion.emoji}</div>
                <div className="suggestion-content">
                  <div className="suggestion-task">{suggestion.text}</div>
                  <div className="suggestion-message">
                    {getTimeMessage(suggestion.timeOfDay)}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {suggestions.length === 0 && (
            <div className="no-suggestions">
              You don't have any pending tasks! Time to celebrate! 🎉
            </div>
          )}
          
          <button 
            className="close-reminders"
            onClick={() => setShowReminders(false)}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default SmartReminders; 