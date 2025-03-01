import React from 'react';
import Todo from './Todo';
import './TodoList.css';

function TodoList({ todos, toggleComplete, deleteTodo, updateTodo, tags }) {
  if (todos.length === 0) {
    return <p className="empty-list">No tasks yet. Add a task to get started!</p>;
  }

  return (
    <div className="todo-list-container">
      <ul className="todo-list">
        {todos.map(todo => (
          <Todo
            key={todo.id}
            todo={todo}
            toggleComplete={toggleComplete}
            deleteTodo={deleteTodo}
            updateTodo={updateTodo}
            tags={tags}
          />
        ))}
      </ul>
    </div>
  );
}

export default TodoList; 