import React, { useState, useEffect } from 'react';
import './CalendarView.css';

function CalendarView({ todos, toggleComplete }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState([]);
  
  // Generate calendar days for the current month view
  useEffect(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);
    
    // Days from previous month to fill the first week
    const daysFromPrevMonth = firstDay.getDay();
    // Total days to show (previous month days + current month days + next month days)
    const totalDays = daysFromPrevMonth + lastDay.getDate() + (6 - lastDay.getDay());
    
    const days = [];
    
    // Add days from previous month
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = daysFromPrevMonth - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonthLastDay - i);
      days.push({
        date,
        isCurrentMonth: false,
        isToday: isSameDay(date, new Date()),
        isSelected: isSameDay(date, selectedDate)
      });
    }
    
    // Add days from current month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(year, month, i);
      days.push({
        date,
        isCurrentMonth: true,
        isToday: isSameDay(date, new Date()),
        isSelected: isSameDay(date, selectedDate)
      });
    }
    
    // Add days from next month
    const daysFromNextMonth = totalDays - days.length;
    for (let i = 1; i <= daysFromNextMonth; i++) {
      const date = new Date(year, month + 1, i);
      days.push({
        date,
        isCurrentMonth: false,
        isToday: isSameDay(date, new Date()),
        isSelected: isSameDay(date, selectedDate)
      });
    }
    
    setCalendarDays(days);
  }, [currentMonth, selectedDate]);
  
  // Check if two dates are the same day
  const isSameDay = (date1, date2) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };
  
  // Get todos for a specific day
  const getTodosForDay = (date) => {
    return todos.filter(todo => {
      if (!todo.createdAt) return false;
      const todoDate = new Date(todo.createdAt);
      return isSameDay(todoDate, date);
    });
  };
  
  // Navigate to previous month
  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };
  
  // Navigate to next month
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };
  
  // Navigate to today
  const goToToday = () => {
    const today = new Date();
    setCurrentMonth(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelectedDate(today);
  };
  
  // Format date to display month and year
  const formatMonthYear = (date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };
  
  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button className="calendar-nav-btn" onClick={prevMonth}>
          ←
        </button>
        <h3 className="current-month">{formatMonthYear(currentMonth)}</h3>
        <button className="calendar-nav-btn" onClick={nextMonth}>
          →
        </button>
        <button className="today-btn" onClick={goToToday}>
          Today
        </button>
      </div>
      
      <div className="weekdays">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="weekday">{day}</div>
        ))}
      </div>
      
      <div className="calendar-grid">
        {calendarDays.map((day, index) => {
          const dayTodos = getTodosForDay(day.date);
          const hasTodos = dayTodos.length > 0;
          const hasCompletedTodos = dayTodos.some(todo => todo.completed);
          const hasOverdueTodos = dayTodos.some(todo => !todo.completed && day.date < new Date());
          
          return (
            <div 
              key={index} 
              className={`calendar-day ${!day.isCurrentMonth ? 'other-month' : ''} ${day.isToday ? 'today' : ''} ${day.isSelected ? 'selected' : ''}`}
              onClick={() => setSelectedDate(day.date)}
            >
              <span className="day-number">{day.date.getDate()}</span>
              
              {hasTodos && (
                <div className="day-indicator">
                  <span 
                    className={`indicator ${hasOverdueTodos ? 'overdue' : ''} ${hasCompletedTodos ? 'completed' : ''}`}
                  >
                    {dayTodos.length}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="selected-day-todos">
        <h4>{selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</h4>
        <div className="day-todos-list">
          {getTodosForDay(selectedDate).length > 0 ? (
            getTodosForDay(selectedDate).map(todo => (
              <div 
                key={todo.id} 
                className={`day-todo-item ${todo.completed ? 'completed' : ''} ${todo.priority}-priority`}
              >
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleComplete(todo.id)}
                  className="todo-checkbox"
                />
                <span className="todo-text">{todo.text}</span>
              </div>
            ))
          ) : (
            <p className="no-todos">No tasks for this day</p>
          )}
        </div>
      </div>
      
      <div className="calendar-legend">
        <div className="legend-item">
          <span className="indicator"></span>
          <span>Tasks</span>
        </div>
        <div className="legend-item">
          <span className="indicator completed"></span>
          <span>Completed</span>
        </div>
        <div className="legend-item">
          <span className="indicator overdue"></span>
          <span>Overdue</span>
        </div>
      </div>
    </div>
  );
}

export default CalendarView; 