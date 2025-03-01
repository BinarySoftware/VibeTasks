import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import './ThemeToggler.css';
import { FiSun, FiMoon, FiHeart, FiChevronDown, FiCheck, FiZap } from 'react-icons/fi';
import { 
  GiCottonFlower, 
  GiTeapot, 
  GiDreamCatcher, 
  GiSunset
} from 'react-icons/gi';
import { 
  FaSnowflake, 
  FaGhost, 
  FaHeart, 
  FaSeedling 
} from 'react-icons/fa';

/**
 * ThemeToggler Component
 * 
 * Allows users to switch between different visual themes:
 * - Default: Kawaii-inspired pink theme with playful design elements
 * - Dark: Dark mode with deep colors for night use
 * - Light: Clean, light theme for minimalist preference
 * - Vibrant: Colorful, energetic theme with bold colors
 * - Cotton Candy: Pastel pink/blue gradient theme
 * - Matcha Latte: Soft green/cream theme inspired by matcha tea
 * - Lavender Dream: Purple/lilac soft theme with dreamy aesthetics
 * - Sunset Peach: Warm oranges/yellows theme reminiscent of sunset
 * 
 * Seasonal themes that automatically activate:
 * - Christmas: Red and green theme (December)
 * - Halloween: Orange and purple theme (October)
 * - Valentine's: Red and pink theme (February)
 * - Spring Bloom: Fresh green theme (March-May)
 * 
 * Features:
 * - Theme selection dropdown menu
 * - Theme preview on hover
 * - Persists theme choice in localStorage
 * - Animated theme transitions
 * - Automatic seasonal themes based on date
 */
const ThemeToggler = ({ onThemeChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTheme, setActiveTheme] = useState('theme-default');
  const [seasonalTheme, setSeasonalTheme] = useState(null);
  const dropdownRef = useRef(null);

  // Define all available themes
  const themes = [
    { id: 'theme-default', name: 'Default', icon: <FiHeart /> },
    { id: 'theme-dark', name: 'Dark Mode', icon: <FiMoon /> },
    { id: 'theme-light', name: 'Light Mode', icon: <FiSun /> },
    { id: 'theme-vibrant', name: 'Vibrant', icon: <FiZap /> },
    { id: 'theme-cotton-candy', name: 'Cotton Candy', icon: <GiCottonFlower /> },
    { id: 'theme-matcha-latte', name: 'Matcha Latte', icon: <GiTeapot /> },
    { id: 'theme-lavender-dream', name: 'Lavender Dream', icon: <GiDreamCatcher /> },
    { id: 'theme-sunset-peach', name: 'Sunset Peach', icon: <GiSunset /> }
  ];

  // Moved to useMemo to prevent recreation on renders
  const seasonalThemes = useMemo(() => [
    { id: 'theme-christmas', name: 'Christmas', icon: <FaSnowflake />, month: 11, message: '🎄 Festive Christmas theme activated! Happy Holidays! 🎅' },
    { id: 'theme-halloween', name: 'Halloween', icon: <FaGhost />, month: 9, message: '🎃 Spooky Halloween theme activated! Trick or treat! 👻' },
    { id: 'theme-valentines', name: 'Valentine\'s', icon: <FaHeart />, month: 1, message: '💘 Sweet Valentine\'s theme activated! Spread the love! 💖' },
    { id: 'theme-spring', name: 'Spring Bloom', icon: <FaSeedling />, months: [2, 3, 4], message: '🌸 Fresh Spring theme activated! Enjoy the bloom! 🌷' }
  ], []);

  // Handle click outside to close dropdown
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  // Check if a seasonal theme should be applied based on current date
  const checkSeasonalTheme = useCallback(() => {
    const now = new Date();
    const currentMonth = now.getMonth(); // 0-11
    
    let currentSeasonalTheme = null;
    
    // Check for each seasonal theme
    for (const theme of seasonalThemes) {
      if (theme.months) {
        // For themes that span multiple months
        if (theme.months.includes(currentMonth)) {
          currentSeasonalTheme = theme;
          break;
        }
      } else if (theme.month === currentMonth) {
        // For themes for a specific month
        currentSeasonalTheme = theme;
        break;
      }
    }
    
    return currentSeasonalTheme;
  }, [seasonalThemes]);

  // Load saved theme on component mount and check for seasonal theme
  useEffect(() => {
    // First check if there's a seasonal theme applicable
    const currentSeasonalTheme = checkSeasonalTheme();
    setSeasonalTheme(currentSeasonalTheme);
    
    // Then load saved theme from localStorage
    const savedTheme = localStorage.getItem('vibeTheme');
    
    if (savedTheme) {
      setActiveTheme(savedTheme);
      document.body.className = savedTheme;
      
      // Notify parent component about the theme change
      if (onThemeChange) {
        onThemeChange(savedTheme);
      }
    }
    
    // Setup click outside handler
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onThemeChange, checkSeasonalTheme]);

  // Change the active theme
  const changeTheme = (themeId) => {
    setActiveTheme(themeId);
    document.body.className = themeId;
    localStorage.setItem('vibeTheme', themeId);
    setIsOpen(false);
    
    // Notify parent component about the theme change
    if (onThemeChange) {
      onThemeChange(themeId);
    }
  };

  // Get all themes, including seasonal if available
  const getAllThemes = () => {
    if (seasonalTheme) {
      // Add the seasonal theme to the list
      const allThemes = [...themes];
      // Add the seasonal theme at the top for extra visibility
      allThemes.unshift({
        id: seasonalTheme.id,
        name: seasonalTheme.name,
        icon: seasonalTheme.icon,
        seasonal: true
      });
      return allThemes;
    }
    return themes;
  };

  return (
    <div className="theme-toggler" ref={dropdownRef}>
      <button
        className="theme-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle theme menu"
      >
        <FiHeart />
        <span>Theme</span>
        <FiChevronDown className={`dropdown-icon ${isOpen ? 'open' : ''}`} />
      </button>

      {isOpen && (
        <div className="theme-dropdown">
          {getAllThemes().map((theme) => (
            <button
              key={theme.id}
              className={`theme-option ${activeTheme === theme.id ? 'active' : ''} ${theme.seasonal ? 'seasonal-option' : ''}`}
              onClick={() => changeTheme(theme.id)}
            >
              <span className="theme-icon">{theme.icon}</span>
              <span>
                {theme.name} 
                {theme.seasonal && (
                  <span className={`seasonal-badge theme-${theme.id.replace('theme-', '')}`}>Seasonal</span>
                )}
              </span>
              {activeTheme === theme.id && <FiCheck className="check-icon" />}
              <div className={`theme-color-preview ${theme.id}-preview`}></div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ThemeToggler; 