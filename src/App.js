import React, { useState, useEffect, useCallback, useMemo } from 'react';
import './App.css';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import TodoFilter from './components/TodoFilter';
import TodoExportImport from './components/TodoExportImport';
import TaskDashboard from './components/TaskDashboard';
import PomodoroTimer from './components/PomodoroTimer';
import TodoTags from './components/TodoTags';
import KanbanView from './components/KanbanView';
import CalendarView from './components/CalendarView';
import { PomodoroProvider, usePomodoro } from './contexts/PomodoroContext';
import LoadingAnimation from './components/LoadingAnimation';
import ThemeToggler from './components/ThemeToggler';
import FloatingMascot from './components/FloatingMascot';
import AchievementBadge from './components/AchievementBadge';
import SmartReminders from './components/SmartReminders';
import TaskStreaks from './components/TaskStreaks';
// import MusicPlayer from './components/MusicPlayer';

// A small component to display the timer status in the header
const PomodoroStatus = React.memo(() => {
  const { isActive, mode, formatTime, timeLeft } = usePomodoro();
  
  if (!isActive) return null;
  
  return (
    <div className="pomodoro-mini-status">
      <span className={`mini-mode ${mode}`}>{mode === 'pomodoro' ? '🍅' : '☕'}</span>
      <span className="mini-time">{formatTime(timeLeft)}</span>
    </div>
  );
});

function AppContent() {
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      return JSON.parse(savedTodos);
    } else {
      return [];
    }
  });
  const [filter, setFilter] = useState('all');
  const [tags, setTags] = useState(() => {
    const savedTags = localStorage.getItem('tags');
    if (savedTags) {
      return JSON.parse(savedTags);
    } else {
      return [
        { id: 1, name: 'Work', color: '#ff75a0' },
        { id: 2, name: 'Personal', color: '#a8d8ea' },
        { id: 3, name: 'Urgent', color: '#fce38a' }
      ];
    }
  });
  const [selectedTag, setSelectedTag] = useState('all');
  const [currentView, setCurrentView] = useState('list'); // list, kanban, calendar
  const [activePanel, setActivePanel] = useState(null); // null, 'dashboard', or 'pomodoro'
  const [isLoading, setIsLoading] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [activeTheme, setActiveTheme] = useState('theme-default');
  
  // Get pomodoro state for active indicator
  const { isActive: isPomodoroActive } = usePomodoro();

  // Memoize localStorage operations to reduce performance impact
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    localStorage.setItem('tags', JSON.stringify(tags));
  }, [tags]);

  // Memoize todos handlers with useCallback to prevent unnecessary re-renders
  const addTodo = useCallback((text, priority = 'medium', tag = null) => {
    const newTodo = {
      id: Date.now(),
      text,
      completed: false,
      priority,
      createdAt: new Date().toISOString(),
      tag: tag
    };
    setTodos(prevTodos => [...prevTodos, newTodo]);
  }, []);

  const toggleComplete = useCallback((id) => {
    setTodos(prevTodos => 
      prevTodos.map(todo => 
        todo.id === id ? { 
          ...todo, 
          completed: !todo.completed,
          completedAt: !todo.completed ? new Date().toISOString() : null
        } : todo
      )
    );
  }, []);

  const deleteTodo = useCallback((id) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
  }, []);

  const clearCompleted = useCallback(() => {
    setTodos(prevTodos => prevTodos.filter(todo => !todo.completed));
  }, []);

  const updateTodo = useCallback((id, newText, newPriority, newTag) => {
    setTodos(prevTodos => 
      prevTodos.map(todo => 
        todo.id === id ? { 
          ...todo, 
          text: newText !== undefined ? newText : todo.text,
          priority: newPriority !== undefined ? newPriority : todo.priority,
          tag: newTag !== undefined ? newTag : todo.tag
        } : todo
      )
    );
  }, []);

  // Memoize tag handlers with useCallback
  const addTag = useCallback((tagName, color) => {
    const newTag = {
      id: Date.now(),
      name: tagName,
      color: color
    };
    setTags(prevTags => [...prevTags, newTag]);
  }, []);

  const deleteTag = useCallback((tagId) => {
    setTags(prevTags => prevTags.filter(tag => tag.id !== tagId));
    // Also remove this tag from any todos that have it
    setTodos(prevTodos => prevTodos.map(todo => 
      todo.tag === tagId ? { ...todo, tag: null } : todo
    ));
    if (selectedTag === tagId) {
      setSelectedTag('all');
    }
  }, [selectedTag]);

  const exportTodos = useCallback(() => {
    const dataStr = JSON.stringify(todos);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'todos.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }, [todos]);

  const importTodos = useCallback((event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedTodos = JSON.parse(e.target.result);
          if (Array.isArray(importedTodos)) {
            setTodos(importedTodos);
          } else {
            alert('Invalid file format');
          }
        } catch (error) {
          alert('Error importing file: ' + error.message);
        }
      };
      reader.readAsText(file);
    }
  }, []);

  const toggleDashboard = useCallback(() => {
    // If dashboard is active, turn it off; otherwise turn on dashboard and turn off pomodoro
    setActivePanel(prevPanel => prevPanel === 'dashboard' ? null : 'dashboard');
  }, []);

  const togglePomodoro = useCallback(() => {
    // If pomodoro is active, turn it off; otherwise turn on pomodoro and turn off dashboard
    setActivePanel(prevPanel => prevPanel === 'pomodoro' ? null : 'pomodoro');
  }, []);

  // Memoize filtered todos to prevent recalculation on every render
  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      // First filter by completion status
      const statusMatch = 
        filter === 'all' ? true : 
        filter === 'active' ? !todo.completed : 
        todo.completed;
      
      // Then filter by tag
      const tagMatch = 
        selectedTag === 'all' ? true : 
        todo.tag === selectedTag;
      
      return statusMatch && tagMatch;
    });
  }, [todos, filter, selectedTag]);

  // Memoize active todos count to prevent recalculation
  const activeTodosCount = useMemo(() => {
    return todos.filter(todo => !todo.completed).length;
  }, [todos]);

  // Memoize content classes to prevent string concatenation on every render
  const getContentClasses = useCallback(() => {
    let classes = 'container-main';
    
    if (!activePanel) {
      classes += ' no-side-panel';
    }
    
    if (currentView === 'kanban') {
      classes += ' kanban-active';
    } else if (currentView === 'calendar') {
      classes += ' calendar-active';
    }
    
    return classes;
  }, [activePanel, currentView]);

  const toggleView = useCallback((view) => {
    if (currentView !== view) {
      setIsLoading(true);
      setTimeout(() => {
        setCurrentView(view);
        setIsLoading(false);
      }, 300); // Short delay for animation
    }
  }, [currentView]);

  // Memoize components that don't need to re-render with the parent component
  // const memoizedMusicPlayer = useMemo(() => {
  //   return <MusicPlayer activeTheme={activeTheme} />;
  // }, [activeTheme]);
  
  const memoizedFloatingMascot = useMemo(() => {
    return <FloatingMascot todos={todos} />;
  }, [todos]);

  const contentClasses = getContentClasses();
  const hasCompletedTodos = useMemo(() => todos.some(todo => todo.completed), [todos]);

  return (
    <div className="app">
      {/* App header with logo, pomodoro status, and theme toggle */}
      <header>
        <h1>✨ Vibe Todo ✨</h1>
        <div className="header-controls">
          <PomodoroStatus />
          <ThemeToggler onThemeChange={(theme) => setActiveTheme(theme)} />
        </div>
      </header>
      
      {/* Floating UI components stacked in order */}
      <div className="floating-ui-container">
        <AchievementBadge todos={todos} />
        <TaskStreaks todos={todos} />
        <SmartReminders todos={todos} />
      </div>
      
      {/* Navigation area with view toggles and panel controls */}
      <div className="view-toggles">
        <div className="main-view-buttons">
          <button 
            className={`view-button ${currentView === 'list' ? 'active' : ''}`}
            onClick={() => toggleView('list')}
          >
            <span className="view-icon">📋</span> List
          </button>
          <button 
            className={`view-button ${currentView === 'kanban' ? 'active' : ''}`}
            onClick={() => toggleView('kanban')}
          >
            <span className="view-icon">📊</span> Kanban
          </button>
          <button 
            className={`view-button ${currentView === 'calendar' ? 'active' : ''}`}
            onClick={() => toggleView('calendar')}
          >
            <span className="view-icon">📅</span> Calendar
          </button>
        </div>
        
        <div className="panel-controls">
          <button
            className={`view-button ${activePanel === 'dashboard' ? 'active' : ''}`}
            onClick={toggleDashboard}
          >
            <span className="feature-icon">📈</span>
            <span className="feature-text">Dashboard</span>
          </button>
          <button
            className={`view-button ${activePanel === 'pomodoro' ? 'active' : ''} ${isPomodoroActive ? 'timer-active' : ''}`}
            onClick={togglePomodoro}
          >
            <span className="feature-icon">⏱️</span>
            <span className="feature-text">Pomodoro</span>
          </button>
        </div>
      </div>
      
      <div className={contentClasses}>
        <div className="main-panel">
          {isLoading ? (
            <LoadingAnimation
              message={`Loading ${currentView} view...`}
              color="purple"
              size="medium"
            />
          ) : (
            <div className="todo-container">
              {currentView === 'list' && (
                <>
                  <TodoForm addTodo={addTodo} tags={tags} />
                  
                  <TodoTags 
                    tags={tags} 
                    addTag={addTag} 
                    deleteTag={deleteTag}
                    selectedTag={selectedTag}
                    setSelectedTag={setSelectedTag}
                  />
                  
                  <TodoFilter 
                    filter={filter} 
                    setFilter={setFilter} 
                    clearCompleted={clearCompleted}
                    activeTodosCount={activeTodosCount}
                    hasCompletedTodos={hasCompletedTodos}
                  />
                  
                  <TodoList 
                    todos={filteredTodos} 
                    toggleComplete={toggleComplete} 
                    deleteTodo={deleteTodo} 
                    updateTodo={updateTodo}
                    tags={tags}
                  />
                  
                  <TodoExportImport 
                    exportTodos={exportTodos}
                    importTodos={importTodos}
                  />
                </>
              )}
              
              {currentView === 'kanban' && (
                <KanbanView 
                  todos={todos}
                  toggleComplete={toggleComplete}
                  deleteTodo={deleteTodo}
                  updateTodo={updateTodo}
                  addTodo={addTodo}
                  tags={tags}
                />
              )}
              
              {currentView === 'calendar' && (
                <CalendarView 
                  todos={todos}
                  toggleComplete={toggleComplete}
                  deleteTodo={deleteTodo}
                  updateTodo={updateTodo}
                  addTodo={addTodo}
                  tags={tags}
                />
              )}
            </div>
          )}
        </div>
        
        {activePanel && (
          <div className="side-panel">
            {activePanel === 'dashboard' && <TaskDashboard todos={todos} />}
            {activePanel === 'pomodoro' && <PomodoroTimer />}
          </div>
        )}
      </div>
      
      {/* Floating mascot that provides encouragement */}
      {memoizedFloatingMascot}
      
      {/* Music player component that integrates with the theme */}
      {/* {memoizedMusicPlayer} */}
    </div>
  );
}

// Wrap the App in React.memo to prevent unnecessary re-renders
const App = React.memo(() => {
  return (
    <PomodoroProvider>
      <AppContent />
    </PomodoroProvider>
  );
});

export default App; 