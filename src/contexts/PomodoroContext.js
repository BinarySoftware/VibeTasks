import React, { createContext, useState, useEffect, useRef, useContext, useCallback } from 'react';

const PomodoroContext = createContext();

export const PomodoroProvider = ({ children }) => {
  const [mode, setMode] = useState(() => {
    const savedMode = localStorage.getItem('pomodoroMode');
    return savedMode || 'pomodoro'; // pomodoro, shortBreak, longBreak
  });
  
  const [timeLeft, setTimeLeft] = useState(() => {
    const savedTimeLeft = localStorage.getItem('pomodoroTimeLeft');
    return savedTimeLeft ? parseInt(savedTimeLeft) : 25 * 60; // 25 minutes in seconds
  });
  
  const [isActive, setIsActive] = useState(() => {
    const savedIsActive = localStorage.getItem('pomodoroIsActive');
    return savedIsActive === 'true';
  });
  
  const [lastActiveTime, setLastActiveTime] = useState(() => {
    const savedLastActiveTime = localStorage.getItem('pomodoroLastActiveTime');
    return savedLastActiveTime ? parseInt(savedLastActiveTime) : null;
  });
  
  const [completedPomodoros, setCompletedPomodoros] = useState(() => {
    const savedCompletedPomodoros = localStorage.getItem('pomodoroCompletedCount');
    return savedCompletedPomodoros ? parseInt(savedCompletedPomodoros) : 0;
  });
  
  const [settings, setSettings] = useState(() => {
    const savedSettings = localStorage.getItem('pomodoroSettings');
    return savedSettings ? JSON.parse(savedSettings) : {
      pomodoro: 25,
      shortBreak: 5,
      longBreak: 15,
      autoStartBreaks: true,
      autoStartPomodoros: false,
      longBreakInterval: 4
    };
  });
  
  const audioRef = useRef(null);
  const timerRef = useRef(null);
  
  // Sync settings to localStorage
  useEffect(() => {
    localStorage.setItem('pomodoroSettings', JSON.stringify(settings));
  }, [settings]);

  // Handle timer completion - moved up and wrapped in useCallback to avoid dependency cycle
  const handleTimerComplete = useCallback(() => {
    // Play notification sound if available
    if (audioRef.current) {
      audioRef.current.play();
    }
    
    // Show browser notification
    if (Notification.permission === 'granted') {
      const modeMessage = mode === 'pomodoro' 
        ? 'Time for a break!' 
        : 'Break is over! Time to focus.';
      
      new Notification('Pomodoro Timer', {
        body: modeMessage,
        icon: '/favicon.ico'
      });
    }
    
    if (mode === 'pomodoro') {
      // Increment completed pomodoros
      const newCompletedCount = completedPomodoros + 1;
      setCompletedPomodoros(newCompletedCount);
      
      // Determine next mode
      if (newCompletedCount % settings.longBreakInterval === 0) {
        setMode('longBreak');
        if (settings.autoStartBreaks) setIsActive(true);
        else setIsActive(false);
      } else {
        setMode('shortBreak');
        if (settings.autoStartBreaks) setIsActive(true);
        else setIsActive(false);
      }
    } else {
      // End of a break period, go back to pomodoro
      setMode('pomodoro');
      if (settings.autoStartPomodoros) setIsActive(true);
      else setIsActive(false);
    }
  }, [mode, completedPomodoros, settings]);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('pomodoroMode', mode);
    localStorage.setItem('pomodoroTimeLeft', timeLeft.toString());
    localStorage.setItem('pomodoroIsActive', isActive.toString());
    localStorage.setItem('pomodoroCompletedCount', completedPomodoros.toString());
    
    if (isActive) {
      localStorage.setItem('pomodoroLastActiveTime', Date.now().toString());
    }
  }, [mode, timeLeft, isActive, completedPomodoros]);
  
  // Account for time that passed when app was closed
  useEffect(() => {
    if (isActive && lastActiveTime) {
      const now = Date.now();
      const elapsedSeconds = Math.floor((now - lastActiveTime) / 1000);
      
      if (elapsedSeconds > 0) {
        if (elapsedSeconds >= timeLeft) {
          // Timer would have completed while app was closed
          handleTimerComplete();
        } else {
          // Subtract elapsed time
          setTimeLeft(prev => prev - elapsedSeconds);
        }
      }
      
      // Reset last active time
      setLastActiveTime(now);
    }
  }, [isActive, lastActiveTime, timeLeft, handleTimerComplete]);
  
  // Set up timer durations when mode changes
  useEffect(() => {
    if (!isActive) {
      switch (mode) {
        case 'pomodoro':
          setTimeLeft(settings.pomodoro * 60);
          break;
        case 'shortBreak':
          setTimeLeft(settings.shortBreak * 60);
          break;
        case 'longBreak':
          setTimeLeft(settings.longBreak * 60);
          break;
        default:
          setTimeLeft(settings.pomodoro * 60);
      }
    }
  }, [mode, settings, isActive]);
  
  // Timer logic
  useEffect(() => {
    if (isActive) {
      setLastActiveTime(Date.now());
      
      timerRef.current = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            clearInterval(timerRef.current);
            handleTimerComplete();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    
    return () => clearInterval(timerRef.current);
  }, [isActive, handleTimerComplete]);
  
  // Format time remaining
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  // Calculate progress percentage
  const calculateProgress = () => {
    let totalTime;
    switch (mode) {
      case 'pomodoro':
        totalTime = settings.pomodoro * 60;
        break;
      case 'shortBreak':
        totalTime = settings.shortBreak * 60;
        break;
      case 'longBreak':
        totalTime = settings.longBreak * 60;
        break;
      default:
        totalTime = settings.pomodoro * 60;
    }
    
    return ((totalTime - timeLeft) / totalTime) * 100;
  };
  
  // Toggle timer start/pause
  const toggleTimer = () => {
    setIsActive(!isActive);
  };
  
  // Reset timer
  const resetTimer = () => {
    setIsActive(false);
    switch (mode) {
      case 'pomodoro':
        setTimeLeft(settings.pomodoro * 60);
        break;
      case 'shortBreak':
        setTimeLeft(settings.shortBreak * 60);
        break;
      case 'longBreak':
        setTimeLeft(settings.longBreak * 60);
        break;
      default:
        setTimeLeft(settings.pomodoro * 60);
    }
  };
  
  // Request notification permission
  const requestNotificationPermission = () => {
    if (Notification && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  };
  
  // Calculate what time the timer will end
  const calculateEndTime = () => {
    if (!isActive) return '';
    
    const now = new Date();
    const endTime = new Date(now.getTime() + timeLeft * 1000);
    return `Ends at ${endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };
  
  // Setup value to be provided by context
  const contextValue = {
    mode,
    setMode,
    timeLeft,
    isActive,
    completedPomodoros,
    settings,
    setSettings,
    audioRef,
    toggleTimer,
    resetTimer,
    formatTime,
    calculateProgress,
    calculateEndTime,
    requestNotificationPermission
  };
  
  return (
    <PomodoroContext.Provider value={contextValue}>
      {children}
      <audio ref={audioRef} src="https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3" />
    </PomodoroContext.Provider>
  );
};

// Custom hook to use the pomodoro context
export const usePomodoro = () => {
  const context = useContext(PomodoroContext);
  if (!context) {
    throw new Error('usePomodoro must be used within a PomodoroProvider');
  }
  return context;
};

export default PomodoroContext; 