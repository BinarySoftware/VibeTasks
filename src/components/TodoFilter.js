import React from 'react';
import './TodoFilter.css';

function TodoFilter({ filter, setFilter, clearCompleted, activeTodosCount, hasCompletedTodos }) {
  return (
    <div className="todo-filter">
      <div className="todo-count">
        <span className="count-number">{activeTodosCount}</span>
        <span>{activeTodosCount === 1 ? 'task' : 'tasks'} left</span>
      </div>
      <div className="filter-buttons">
        <button 
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button 
          className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
          onClick={() => setFilter('active')}
        >
          Active
        </button>
        <button 
          className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
          onClick={() => setFilter('completed')}
        >
          Completed
        </button>
      </div>
      {hasCompletedTodos && (
        <button 
          className="clear-completed"
          onClick={clearCompleted}
        >
          Clear completed
        </button>
      )}
    </div>
  );
}

export default TodoFilter; 