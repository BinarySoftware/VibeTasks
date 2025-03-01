import React, { useEffect, useState, useCallback } from 'react';
import './ProgressBar.css';

const ProgressBar = ({ todos }) => {
  const [progress, setProgress] = useState(0);
  const [animation, setAnimation] = useState(false);
  const [milestone, setMilestone] = useState(null);
  
  // Check for achievement milestones - wrapped in useCallback
  const checkMilestones = useCallback((newProgress) => {
    const milestones = [
      { threshold: 25, message: "You're making progress! 🌱", emoji: "🌱" },
      { threshold: 50, message: "Halfway there! Keep going! 🌿", emoji: "🌿" },
      { threshold: 75, message: "Almost there! You're doing great! 🌳", emoji: "🌳" },
      { threshold: 100, message: "All done! Amazing job! 🎉", emoji: "🎉" }
    ];
    
    // Find the highest milestone achieved
    for (let i = milestones.length - 1; i >= 0; i--) {
      if (newProgress >= milestones[i].threshold && progress < milestones[i].threshold) {
        setMilestone(milestones[i]);
        setTimeout(() => setMilestone(null), 3000);
        break;
      }
    }
  }, [progress]);
  
  // Calculate progress when todos change
  useEffect(() => {
    if (!todos || todos.length === 0) {
      setProgress(0);
      return;
    }
    
    const totalTasks = todos.length;
    const completedTasks = todos.filter(todo => todo.completed).length;
    const newProgress = Math.round((completedTasks / totalTasks) * 100);
    
    // If progress increased, trigger animation
    if (newProgress > progress) {
      setAnimation(true);
      setTimeout(() => setAnimation(false), 1500);
      
      // Check for milestones
      checkMilestones(newProgress);
    }
    
    setProgress(newProgress);
  }, [todos, progress, checkMilestones]);
  
  // Get the emoji character for the progress indicator
  const getProgressEmoji = () => {
    if (progress === 0) return '🌱'; // Seed
    if (progress < 25) return '🌱'; // Sprouting
    if (progress < 50) return '🌿'; // Small plant
    if (progress < 75) return '🌳'; // Growing tree
    if (progress < 100) return '🌳'; // Almost full tree
    return '🌸'; // Blooming tree
  };
  
  return (
    <div className="progress-container">
      <div className="progress-label">
        <div className="progress-text">
          <span>Progress</span>
          <span className="progress-percentage">{progress}%</span>
        </div>
      </div>
      
      <div className="progress-bar-container">
        <div 
          className={`progress-bar ${animation ? 'animate' : ''}`} 
          style={{ width: `${progress}%` }}
          aria-valuenow={progress}
          aria-valuemin="0"
          aria-valuemax="100"
        >
          {progress > 0 && (
            <span className="progress-emoji">{getProgressEmoji()}</span>
          )}
        </div>
      </div>
      
      {milestone && (
        <div className="milestone-notification">
          <span className="milestone-emoji">{milestone.emoji}</span>
          <span className="milestone-message">{milestone.message}</span>
        </div>
      )}
    </div>
  );
};

export default ProgressBar; 