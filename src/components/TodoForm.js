import React, { useState } from 'react';
import './TodoForm.css';

function TodoForm({ addTodo, tags }) {
  const [value, setValue] = useState('');
  const [priority, setPriority] = useState('medium');
  const [selectedTag, setSelectedTag] = useState(null);
  const [showTagDropdown, setShowTagDropdown] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value.trim()) return;
    
    addTodo(value, priority, selectedTag);
    setValue('');
    setPriority('medium');
    setSelectedTag(null);
  };

  const toggleTagDropdown = () => {
    setShowTagDropdown(!showTagDropdown);
  };

  const selectTag = (tagId) => {
    setSelectedTag(tagId);
    setShowTagDropdown(false);
  };

  // Find the selected tag's information
  const selectedTagInfo = selectedTag ? tags.find(tag => tag.id === selectedTag) : null;

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <div className="input-container">
        <input
          type="text"
          className="todo-input"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Add a new vibe task..."
        />
        <div className="priority-selector">
          <label className="priority-label">Priority:</label>
          <div className="priority-options">
            <label className={`priority-option ${priority === 'low' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="priority"
                value="low"
                checked={priority === 'low'}
                onChange={() => setPriority('low')}
              />
              <span className="priority-checkbox low">Low</span>
            </label>
            <label className={`priority-option ${priority === 'medium' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="priority"
                value="medium"
                checked={priority === 'medium'}
                onChange={() => setPriority('medium')}
              />
              <span className="priority-checkbox medium">Medium</span>
            </label>
            <label className={`priority-option ${priority === 'high' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="priority"
                value="high"
                checked={priority === 'high'}
                onChange={() => setPriority('high')}
              />
              <span className="priority-checkbox high">High</span>
            </label>
          </div>
        </div>

        <div className="tag-selector">
          <label className="tag-label">Tag:</label>
          <div className="tag-dropdown-container">
            <button 
              type="button" 
              className="tag-dropdown-button"
              onClick={toggleTagDropdown}
            >
              {selectedTagInfo ? (
                <span 
                  className="selected-tag-indicator" 
                  style={{ backgroundColor: selectedTagInfo.color }}
                >
                  {selectedTagInfo.name}
                </span>
              ) : (
                "Select a Tag"
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
      <button type="submit" className="todo-button">
        Add Task
      </button>
    </form>
  );
}

export default TodoForm; 