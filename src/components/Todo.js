import React, { useState } from 'react';
import './Todo.css';

function Todo({ todo, toggleComplete, deleteTodo, updateTodo, tags }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [editPriority, setEditPriority] = useState(todo.priority || 'medium');
  const [editTag, setEditTag] = useState(todo.tag);
  const [isRemoving, setIsRemoving] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showTagDropdown, setShowTagDropdown] = useState(false);
  const [celebrationMessage, setCelebrationMessage] = useState('');

  // Function to get random kawaii celebration message
  const getRandomCelebrationMessage = () => {
    const messages = [
      'Great job! ✨',
      'Yay! Task complete! 🎉',
      'You did it! 🌈',
      'So productive! 🌟',
      'Amazing! Keep going! 💖',
      'Task vanquished! 💪',
      'Super kawaii progress! 🌸',
      'Productivity level up! 🚀',
      'Sparkly success! ✨',
      'Task completed with cuteness! 🧸'
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditText(todo.text);
    setEditPriority(todo.priority || 'medium');
    setEditTag(todo.tag);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!editText.trim()) return;
    updateTodo(todo.id, editText, editPriority, editTag);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditText(todo.text);
    setEditPriority(todo.priority || 'medium');
    setEditTag(todo.tag);
  };

  const handleDelete = () => {
    setIsRemoving(true);
    // Wait for animation to complete before removing
    setTimeout(() => {
      deleteTodo(todo.id);
    }, 300);
  };

  const handleToggleComplete = () => {
    toggleComplete(todo.id);
    
    // Show confetti when marking as complete
    if (!todo.completed) {
      setShowConfetti(true);
      setCelebrationMessage(getRandomCelebrationMessage());
      
      // Play a cute sound when completing a task
      const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-magical-coin-win-1936.mp3');
      audio.volume = 0.3;
      audio.play().catch(e => console.log('Audio play failed: ', e));
      
      setTimeout(() => {
        setShowConfetti(false);
      }, 3000); // Longer confetti time for more celebration
    }
  };

  // Get priority class name
  const getPriorityClass = (priority) => {
    switch(priority) {
      case 'high': return 'high-priority';
      case 'low': return 'low-priority';
      default: return 'medium-priority';
    }
  };
  
  // Find the tag info if it exists
  const getTagInfo = (tagId) => {
    if (!tagId) return null;
    return tags.find(tag => tag.id === tagId) || null;
  };
  
  const tagInfo = getTagInfo(todo.tag);
  
  const toggleTagDropdown = () => {
    setShowTagDropdown(!showTagDropdown);
  };
  
  const selectTag = (tagId) => {
    setEditTag(tagId);
    setShowTagDropdown(false);
  };

  return (
    <li className={`todo-item ${isRemoving ? 'removing' : ''} ${getPriorityClass(todo.priority || 'medium')}`}>
      {isEditing ? (
        <form className="edit-form" onSubmit={handleSubmit}>
          <input
            type="text"
            className="edit-input"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            autoFocus
          />
          <div className="edit-options">
            <div className="edit-priority">
              <select 
                value={editPriority} 
                onChange={(e) => setEditPriority(e.target.value)}
                className={`priority-select ${editPriority}`}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            
            <div className="edit-tag">
              <div className="tag-dropdown-container">
                <button 
                  type="button" 
                  className="tag-dropdown-button"
                  onClick={toggleTagDropdown}
                >
                  {editTag && getTagInfo(editTag) ? (
                    <span 
                      className="selected-tag-indicator" 
                      style={{ backgroundColor: getTagInfo(editTag).color }}
                    >
                      {getTagInfo(editTag).name}
                    </span>
                  ) : (
                    "No Tag"
                  )}
                </button>
                
                {showTagDropdown && (
                  <div className="tag-dropdown-menu">
                    <button 
                      type="button" 
                      className="tag-dropdown-item no-tag"
                      onClick={() => selectTag(null)}
                    >
                      No Tag
                    </button>
                    
                    {tags.map(tag => (
                      <button
                        key={tag.id}
                        type="button"
                        className="tag-dropdown-item"
                        style={{ 
                          backgroundColor: tag.color + '20', 
                          borderLeft: `4px solid ${tag.color}` 
                        }}
                        onClick={() => selectTag(tag.id)}
                      >
                        {tag.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="edit-buttons">
            <button type="submit" className="save-button">Save</button>
            <button type="button" className="cancel-button" onClick={handleCancel}>Cancel</button>
          </div>
        </form>
      ) : (
        <>
          <div className="todo-content">
            <input
              type="checkbox"
              className="todo-checkbox"
              checked={todo.completed}
              onChange={handleToggleComplete}
            />
            <div className="todo-info">
              <span 
                className={`todo-text ${todo.completed ? 'completed' : ''}`}
                onDoubleClick={handleEdit}
              >
                {todo.text}
              </span>
              <div className="todo-meta">
                <span className={`todo-priority ${getPriorityClass(todo.priority || 'medium')}`}>
                  {todo.priority || 'medium'}
                </span>
                {tagInfo && (
                  <span 
                    className="todo-tag" 
                    style={{ backgroundColor: tagInfo.color }}
                  >
                    {tagInfo.name}
                  </span>
                )}
                {todo.createdAt && (
                  <span className="todo-date">
                    {new Date(todo.createdAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="todo-actions">
            <button 
              className="edit-button"
              onClick={handleEdit}
              disabled={todo.completed}
              aria-label="Edit task"
            >
              Edit
            </button>
            <button 
              className="delete-button"
              onClick={handleDelete}
              aria-label="Delete task"
            >
              Delete
            </button>
          </div>
          {showConfetti && (
            <div className="confetti-container">
              {/* More confetti particles for a fuller effect */}
              {[...Array(60)].map((_, i) => {
                // Random confetti styles
                const colors = [
                  '#FFD1DC', // pastel pink
                  '#FFACAC', // light pink
                  '#FDFD96', // pastel yellow
                  '#A7C7E7', // pastel blue
                  '#C1E1C1', // pastel green
                  '#C3B1E1', // pastel purple
                  '#FA897B', // coral
                  '#FFDA29', // bright yellow
                ];
                
                // Random shapes: circle, square, heart, or star
                const shapes = [
                  'circle',   // circle
                  'square',   // square
                  'heart',    // heart
                  'star'      // star
                ];
                
                const randomColor = colors[Math.floor(Math.random() * colors.length)];
                const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
                const randomSize = 5 + Math.random() * 10; // between 5-15px
                
                return (
                  <div
                    key={i}
                    className={`confetti confetti-${randomShape}`}
                    style={{
                      left: `${Math.random() * 100}%`,
                      width: `${randomSize}px`,
                      height: `${randomSize}px`,
                      backgroundColor: randomColor,
                      animationDelay: `${Math.random() * 0.8}s`,
                      animationDuration: `${1 + Math.random() * 2}s`, // between 1-3s
                    }}
                  />
                );
              })}
              <div className="completion-message">
                <span className="completion-emoji">✨</span>
                <span>{celebrationMessage}</span>
                <span className="completion-emoji">🎉</span>
              </div>
            </div>
          )}
        </>
      )}
    </li>
  );
}

export default Todo; 