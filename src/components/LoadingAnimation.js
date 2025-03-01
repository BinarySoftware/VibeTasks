import React from 'react';
import './LoadingAnimation.css';

/**
 * A kawaii-style loading animation component
 * @param {Object} props Component props
 * @param {string} props.message Optional loading message to display
 * @param {string} props.size Size of the loading animation ('small', 'medium', 'large')
 * @param {string} props.color Color theme for the animation
 */
const LoadingAnimation = ({ message = 'Loading...', size = 'medium', color = 'blue' }) => {
  const getSize = () => {
    switch (size) {
      case 'small': return 'loading-small';
      case 'large': return 'loading-large';
      default: return 'loading-medium';
    }
  };

  const getColor = () => {
    switch (color) {
      case 'pink': return 'loading-pink';
      case 'purple': return 'loading-purple';
      case 'green': return 'loading-green';
      default: return 'loading-blue';
    }
  };
  
  return (
    <div className={`loading-container ${getSize()}`}>
      <div className={`loading-animation ${getColor()}`}>
        <div className="loading-star">★</div>
        <div className="loading-star">★</div>
        <div className="loading-star">★</div>
      </div>
      {message && <div className="loading-message">{message}</div>}
    </div>
  );
};

export default LoadingAnimation; 