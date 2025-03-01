import React, { useState, useEffect, useMemo } from 'react';
import './AchievementBadge.css';

const AchievementBadge = ({ todos }) => {
  const [achievements, setAchievements] = useState(() => {
    const savedAchievements = localStorage.getItem('vibe-todo-achievements');
    return savedAchievements ? JSON.parse(savedAchievements) : {};
  });
  
  const [newAchievement, setNewAchievement] = useState(null);
  const [showBadges, setShowBadges] = useState(false);
  
  // Define all possible achievements - wrapped in useMemo to avoid recreating on every render
  const achievementsList = useMemo(() => [
    {
      id: 'first_task',
      name: 'First Step',
      description: 'Complete your first task',
      icon: '🌟',
      condition: (todos) => todos.some(todo => todo.completed),
      rarity: 'common'
    },
    {
      id: 'five_tasks',
      name: 'Getting Things Done',
      description: 'Complete 5 tasks',
      icon: '⭐',
      condition: (todos) => todos.filter(todo => todo.completed).length >= 5,
      rarity: 'common'
    },
    {
      id: 'ten_tasks',
      name: 'Productivity Star',
      description: 'Complete 10 tasks',
      icon: '🏆',
      condition: (todos) => todos.filter(todo => todo.completed).length >= 10,
      rarity: 'uncommon'
    },
    {
      id: 'high_priority',
      name: 'Priority Handler',
      description: 'Complete a high priority task',
      icon: '🔥',
      condition: (todos) => todos.some(todo => todo.completed && todo.priority === 'high'),
      rarity: 'uncommon'
    },
    {
      id: 'all_done',
      name: 'Clean Slate',
      description: 'Complete all tasks in your list',
      icon: '✨',
      condition: (todos) => todos.length > 0 && todos.every(todo => todo.completed),
      rarity: 'rare'
    },
    {
      id: 'five_high_priority',
      name: 'Fire Fighter',
      description: 'Complete 5 high priority tasks',
      icon: '🎖️',
      condition: (todos) => todos.filter(todo => todo.completed && todo.priority === 'high').length >= 5,
      rarity: 'rare'
    }
  ], []);
  
  // Check for new achievements
  useEffect(() => {
    if (!todos || todos.length === 0) return;
    
    // Check each achievement
    achievementsList.forEach(achievement => {
      // If achievement is already earned, skip
      if (achievements[achievement.id]) return;
      
      // Check if achievement condition is met
      if (achievement.condition(todos)) {
        // Award new achievement
        const newAchievements = { ...achievements, [achievement.id]: Date.now() };
        setAchievements(newAchievements);
        
        // Show notification
        setNewAchievement(achievement);
        
        // Hide notification after 5 seconds
        setTimeout(() => {
          setNewAchievement(null);
        }, 5000);
      }
    });
  }, [todos, achievements, achievementsList]);
  
  // Save achievements to localStorage
  useEffect(() => {
    localStorage.setItem('vibe-todo-achievements', JSON.stringify(achievements));
  }, [achievements]);
  
  // Count earned achievements
  const earnedCount = Object.keys(achievements).length;
  const totalCount = achievementsList.length;
  
  return (
    <div className="achievements-widget">
      <button 
        className="achievements-button"
        onClick={() => setShowBadges(!showBadges)}
      >
        <span className="achievement-icon">🏆</span>
        <span className="achievement-count">{earnedCount}/{totalCount}</span>
      </button>
      
      {showBadges && (
        <div className="achievements-panel">
          <h3 className="achievements-title">Achievements</h3>
          <div className="achievements-list">
            {achievementsList.map(achievement => {
              const isEarned = !!achievements[achievement.id];
              return (
                <div 
                  key={achievement.id}
                  className={`achievement-badge ${isEarned ? 'earned' : 'locked'} ${achievement.rarity}`}
                >
                  <div className="badge-icon">{isEarned ? achievement.icon : '🔒'}</div>
                  <div className="badge-info">
                    <div className="badge-name">{achievement.name}</div>
                    <div className="badge-description">{achievement.description}</div>
                    {isEarned && (
                      <div className="badge-earned-date">
                        Earned: {new Date(achievements[achievement.id]).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <button 
            className="close-achievements"
            onClick={() => setShowBadges(false)}
          >
            Close
          </button>
        </div>
      )}
      
      {newAchievement && (
        <div className="achievement-notification">
          <div className="notification-icon">{newAchievement.icon}</div>
          <div className="notification-content">
            <div className="notification-title">Achievement Unlocked!</div>
            <div className="notification-name">{newAchievement.name}</div>
            <div className="notification-description">{newAchievement.description}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AchievementBadge; 