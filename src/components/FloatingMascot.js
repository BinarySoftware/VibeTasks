import React, { useState, useEffect, useRef, useCallback } from 'react';
import './FloatingMascot.css';

const FloatingMascot = ({ todos }) => {
  const [message, setMessage] = useState('');
  const [isVisible] = useState(true);
  const [mascotType, setMascotType] = useState(() => {
    const savedMascot = localStorage.getItem('vibe-todo-mascot');
    return savedMascot || 'default';
  });
  const [bubbleVisible, setBubbleVisible] = useState(false);
  const [showMascotMenu, setShowMascotMenu] = useState(false);
  
  // Use ref for interval to prevent issues with cleanup
  const messageIntervalRef = useRef(null);
  
  // Available mascot options
  const mascotOptions = [
    { id: 'default', face: '(◕‿◕)', name: 'Default' },
    { id: 'happy', face: '(＾▽＾)', name: 'Happy' },
    { id: 'excited', face: '(ﾟДﾟ)', name: 'Excited' },
    { id: 'sleepy', face: '(￣ｏ￣)', name: 'Sleepy' },
    { id: 'cat', face: '(=^･ω･^=)', name: 'Cat' },
    { id: 'bunny', face: '(•ㅅ•)', name: 'Bunny' },
    { id: 'bear', face: 'ʕ•ᴥ•ʔ', name: 'Bear' },
    { id: 'dog', face: '(ᵔᴥᵔ)', name: 'Dog' }
  ];

  // Get a mascot based on app state
  const getMascotContent = () => {
    const selectedMascot = mascotOptions.find(m => m.id === mascotType);
    return selectedMascot ? selectedMascot.face : '(◕‿◕)';
  };

  // Save mascot selection to localStorage
  useEffect(() => {
    localStorage.setItem('vibe-todo-mascot', mascotType);
  }, [mascotType]);

  // Get appropriate message based on todos state - wrapped in useCallback
  const getRandomMessage = useCallback(() => {
    const messages = [
      'Need to get something done?',
      'Time to be productive!',
      'You can do it!',
      'Remember to take breaks too!',
      'One task at a time...',
      'Stay focused!',
      'What\'s your priority today?',
      'Keep going!',
      'Progress feels great!',
      'You\'re doing amazing!'
    ];
    
    // Check todos state for context-specific messages
    if (todos) {
      const completedCount = todos.filter(todo => todo.completed).length;
      const totalCount = todos.length;
      
      if (totalCount === 0) {
        return 'Add some tasks to get started!';
      }
      
      if (completedCount === totalCount && totalCount > 0) {
        setMascotType('happy');
        return 'All done! You\'re amazing! ✨';
      }
      
      if (completedCount > 0) {
        setMascotType('happy');
        return `You've completed ${completedCount} ${completedCount === 1 ? 'task' : 'tasks'} today!`;
      }
      
      const highPriorityCount = todos.filter(todo => !todo.completed && todo.priority === 'high').length;
      if (highPriorityCount > 0) {
        setMascotType('excited');
        return 'You have high priority tasks waiting!';
      }
    }
    
    return messages[Math.floor(Math.random() * messages.length)];
  }, [todos]); // Add todos as dependency

  // Set up and clean up the message display interval (with reduced frequency)
  useEffect(() => {
    // Initial message after a short delay
    const initialTimeout = setTimeout(() => {
      setMessage(getRandomMessage());
      setBubbleVisible(true);
      
      // Hide after a few seconds
      setTimeout(() => {
        setBubbleVisible(false);
      }, 5000);
    }, 3000);
    
    // Set up interval for random messages - increased to 30 seconds for better performance
    messageIntervalRef.current = setInterval(() => {
      // Only 20% chance to show a message to reduce frequency
      if (Math.random() > 0.8) {
        setMessage(getRandomMessage());
        setBubbleVisible(true);
        
        // Hide the bubble after a few seconds
        setTimeout(() => {
          setBubbleVisible(false);
        }, 5000);
      }
    }, 30000); // Check every 30 seconds instead of 10
    
    // Clean up function
    return () => {
      clearTimeout(initialTimeout);
      if (messageIntervalRef.current) {
        clearInterval(messageIntervalRef.current);
      }
    };
  }, [todos, getRandomMessage]); // Added getRandomMessage as dependency

  // Toggle the mascot visibility when clicked
  const toggleMascot = () => {
    if (bubbleVisible) {
      // If bubble is visible, hide it
      setBubbleVisible(false);
    } else {
      // Otherwise show a new message
      setMessage(getRandomMessage());
      setBubbleVisible(true);
      
      // Auto-hide after 5 seconds
      setTimeout(() => {
        setBubbleVisible(false);
      }, 5000);
    }
  };
  
  // Long press handler to show mascot menu
  const handleLongPress = () => {
    setShowMascotMenu(true);
    setBubbleVisible(false);
  };
  
  // Change the mascot type
  const changeMascot = (type) => {
    setMascotType(type);
    setShowMascotMenu(false);
    
    // Show a confirmation message
    setMessage(`Mascot changed to ${mascotOptions.find(m => m.id === type).name}!`);
    setBubbleVisible(true);
    
    // Hide the message after a few seconds
    setTimeout(() => {
      setBubbleVisible(false);
    }, 3000);
  };

  return (
    <div className={`floating-mascot ${isVisible ? 'visible' : 'hidden'}`}>
      <div 
        className={`mascot-bubble ${bubbleVisible ? 'visible' : ''}`}
      >
        {message}
      </div>
      
      {showMascotMenu && (
        <div className="mascot-menu">
          <div className="mascot-menu-title">Choose your mascot:</div>
          <div className="mascot-options">
            {mascotOptions.map((option) => (
              <button 
                key={option.id}
                className={`mascot-option ${mascotType === option.id ? 'active' : ''}`}
                onClick={() => changeMascot(option.id)}
              >
                <span className="mascot-option-face">{option.face}</span>
                <span className="mascot-option-name">{option.name}</span>
              </button>
            ))}
          </div>
          <button 
            className="mascot-menu-close"
            onClick={() => setShowMascotMenu(false)}
          >
            Close
          </button>
        </div>
      )}
      
      <div 
        className="mascot-face"
        onClick={toggleMascot}
        onContextMenu={(e) => {
          e.preventDefault();
          handleLongPress();
        }}
        onTouchStart={() => {
          const timer = setTimeout(() => {
            handleLongPress();
          }, 800); // Long press after 800ms
          return () => clearTimeout(timer);
        }}
      >
        {getMascotContent()}
      </div>
    </div>
  );
};

export default FloatingMascot; 