import React, { useState, useMemo } from 'react';
import './KanbanView.css';

function KanbanView({ todos, toggleComplete, deleteTodo, updateTodo, tags }) {
  const [draggedTodo, setDraggedTodo] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);

  // Define our columns with their status and priority criteria
  const columns = {
    backlog: { 
      title: 'Backlog', 
      emoji: '📝', 
      color: 'var(--kawaii-blue)',
      isCompleted: false
    },
    todo: { 
      title: 'To Do', 
      emoji: '📌', 
      color: 'var(--kawaii-purple)',
      isCompleted: false
    },
    inProgress: { 
      title: 'In Progress', 
      emoji: '🔥', 
      color: 'var(--kawaii-pink)',
      isCompleted: false
    },
    completed: { 
      title: 'Completed', 
      emoji: '✨', 
      color: 'var(--kawaii-green)',
      isCompleted: true
    }
  };

  // Memoize the grouped todos to prevent unnecessary filtering on each render
  const todoGroups = useMemo(() => {
    return {
      backlog: todos.filter(todo => !todo.completed && todo.priority === 'low'),
      todo: todos.filter(todo => !todo.completed && todo.priority === 'medium'),
      inProgress: todos.filter(todo => !todo.completed && todo.priority === 'high'),
      completed: todos.filter(todo => todo.completed)
    };
  }, [todos]);

  const handleDragStart = (todo) => {
    setDraggedTodo(todo);
  };

  const handleDragOver = (e, columnKey) => {
    e.preventDefault();
    setDragOverColumn(columnKey);
  };
  
  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = (targetStatus) => {
    setDragOverColumn(null);
    if (!draggedTodo) return;

    const sourceStatus = getStatusForTodo(draggedTodo);
    if (sourceStatus === targetStatus) return; // No change needed

    // Only change completion status or priority based on the column it was dropped in
    if (targetStatus === 'completed' && !draggedTodo.completed) {
      // Mark as completed without changing priority
      toggleComplete(draggedTodo.id);
    } 
    else if (sourceStatus === 'completed' && targetStatus !== 'completed') {
      // Move from completed to another column
      toggleComplete(draggedTodo.id);
      
      // Then update priority based on the target column
      const newPriority = getPriorityForColumn(targetStatus);
      if (newPriority !== draggedTodo.priority) {
        updateTodo(draggedTodo.id, undefined, newPriority);
      }
    }
    else if (targetStatus !== 'completed') {
      // Only update priority between non-completed columns (without toggling completion)
      const newPriority = getPriorityForColumn(targetStatus);
      if (newPriority !== draggedTodo.priority) {
        updateTodo(draggedTodo.id, undefined, newPriority);
      }
    }

    setDraggedTodo(null);
  };

  // Helper function to get the current status column of a todo item
  const getStatusForTodo = (todo) => {
    if (todo.completed) return 'completed';
    if (todo.priority === 'high') return 'inProgress';
    if (todo.priority === 'medium') return 'todo';
    return 'backlog';
  };

  // Helper function to get the priority that corresponds to a column
  const getPriorityForColumn = (columnKey) => {
    switch (columnKey) {
      case 'backlog': return 'low';
      case 'todo': return 'medium';
      case 'inProgress': return 'high';
      default: return 'medium'; // Default priority
    }
  };

  // Find tag info - memoize by tag ID to prevent finding on every render
  const getTagInfo = (tagId) => {
    if (!tagId) return null;
    return tags.find(tag => tag.id === tagId) || null;
  };

  // Render a todo card for Kanban view
  const renderTodoCard = (todo) => {
    const tagInfo = getTagInfo(todo.tag);
    
    return (
      <div 
        key={todo.id} 
        className={`kanban-card ${getPriorityClass(todo.priority)} ${todo.id === draggedTodo?.id ? 'dragging' : ''}`}
        draggable
        onDragStart={() => handleDragStart(todo)}
      >
        <div className="card-header">
          {tagInfo && (
            <span 
              className="card-tag" 
              style={{ backgroundColor: tagInfo.color }}
            >
              {tagInfo.name}
            </span>
          )}
          <div className="card-actions">
            <button 
              className="card-action-btn delete"
              onClick={() => deleteTodo(todo.id)}
              aria-label="Delete task"
            >
              ×
            </button>
          </div>
        </div>
        
        <div className="card-content">
          <p className={`card-text ${todo.completed ? 'completed' : ''}`}>
            {todo.text}
          </p>
        </div>
        
        <div className="card-footer">
          {todo.createdAt && (
            <span className="card-date">
              {new Date(todo.createdAt).toLocaleDateString()}
            </span>
          )}
          <button 
            className="card-action-btn toggle"
            onClick={() => toggleComplete(todo.id)}
          >
            {todo.completed ? '↩' : '✓'}
          </button>
        </div>
      </div>
    );
  };

  // Helper function to get priority class
  const getPriorityClass = (priority) => {
    switch(priority) {
      case 'high': return 'high-priority';
      case 'low': return 'low-priority';
      default: return 'medium-priority';
    }
  };

  // Get total task count - memoize to prevent recalculation on every render
  const totalTaskCount = useMemo(() => {
    return Object.values(todoGroups).reduce((acc, column) => acc + column.length, 0);
  }, [todoGroups]);

  return (
    <>
      {totalTaskCount === 0 ? (
        <div className="kanban-empty-state">
          <div className="empty-state-icon">📋</div>
          <h3>No tasks yet!</h3>
          <p>Add some tasks to get started with your Kanban board.</p>
          <p>You can create, organize, and track your tasks visually.</p>
        </div>
      ) : (
        <div className="kanban-container">
          {Object.keys(columns).map(columnKey => {
            const columnInfo = columns[columnKey];
            const columnTodos = todoGroups[columnKey];
            const isColumnEmpty = columnTodos.length === 0;
            const isDropTarget = dragOverColumn === columnKey;
            
            return (
              <div 
                key={columnKey} 
                className={`kanban-column ${isColumnEmpty ? 'empty' : ''} ${isDropTarget ? 'drop-target' : ''}`}
                style={{ '--column-accent-color': columnInfo.color }}
                onDragOver={(e) => handleDragOver(e, columnKey)}
                onDragLeave={handleDragLeave}
                onDrop={() => handleDrop(columnKey)}
              >
                <div className="column-header">
                  <span className="column-emoji">{columnInfo.emoji}</span>
                  <h3 className="column-title">{columnInfo.title}</h3>
                  <span className="todo-count">{columnTodos.length}</span>
                </div>
                
                <div className="column-content">
                  {columnTodos.length > 0 ? (
                    columnTodos.map(todo => renderTodoCard(todo))
                  ) : (
                    <div className="empty-column">
                      <p>No tasks yet</p>
                      <p>Drag and drop tasks here</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

// Export as memoized component to prevent unnecessary re-renders
export default React.memo(KanbanView); 