import React, { useState } from 'react';
import './TodoTags.css';

function TodoTags({ tags, addTag, deleteTag, selectedTag, setSelectedTag }) {
  const [newTagName, setNewTagName] = useState('');
  const [isAddingTag, setIsAddingTag] = useState(false);
  
  // Predefined array of colors for new tags
  const tagColors = [
    '#4e44ce', // Indigo
    '#00b894', // Green
    '#e84393', // Pink
    '#00cec9', // Teal
    '#fdcb6e', // Yellow
    '#e17055', // Orange
    '#6c5ce7', // Purple
    '#0984e3', // Blue
    '#d63031', // Red
    '#2d3436'  // Dark Gray
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newTagName.trim()) return;
    
    // Generate a random color from our array
    const randomColor = tagColors[Math.floor(Math.random() * tagColors.length)];
    
    addTag(newTagName, randomColor);
    setNewTagName('');
    setIsAddingTag(false);
  };

  const handleCancel = () => {
    setNewTagName('');
    setIsAddingTag(false);
  };

  return (
    <div className="tags-container">
      <div className="tags-header">
        <h3 className="tags-title">Categories</h3>
        <button 
          className="add-tag-button" 
          onClick={() => setIsAddingTag(true)}
          style={{ display: isAddingTag ? 'none' : 'block' }}
        >
          + New Category
        </button>
      </div>
      
      {isAddingTag && (
        <form className="tag-form" onSubmit={handleSubmit}>
          <input
            type="text"
            className="tag-input"
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            placeholder="Enter category name..."
            autoFocus
          />
          <div className="tag-form-buttons">
            <button 
              type="button" 
              className="tag-cancel-button"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="tag-submit-button"
              disabled={!newTagName.trim()}
            >
              Add
            </button>
          </div>
        </form>
      )}
      
      <div className="tags-list">
        <button
          className={`tag-chip all ${selectedTag === 'all' ? 'selected' : ''}`}
          onClick={() => setSelectedTag('all')}
        >
          All
        </button>
        
        {tags.map(tag => (
          <div key={tag.id} className="tag-chip-container">
            <button
              className={`tag-chip ${selectedTag === tag.id ? 'selected' : ''}`}
              style={{ backgroundColor: tag.color }}
              onClick={() => setSelectedTag(tag.id)}
            >
              {tag.name}
            </button>
            <button 
              className="delete-tag-button"
              onClick={() => deleteTag(tag.id)}
              aria-label={`Delete ${tag.name} tag`}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TodoTags; 