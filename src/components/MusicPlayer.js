import React, { useState, useEffect, useRef } from 'react';
import './MusicPlayer.css';
import { FaMusic, FaTimes, FaVolumeUp } from 'react-icons/fa';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

/**
 * MusicPlayer Component - Optimized version
 * 
 * Uses pre-recorded audio tracks instead of procedural generation
 * to significantly reduce CPU and memory usage
 */
const MusicPlayer = ({ activeTheme }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [volume, setVolume] = useState(0.6);
  
  // Map themes to mood-appropriate tracks
  const themeMoodMap = {
    'default': 'relaxing',
    'dark': 'ambient',
    'light': 'relaxing',
    'vibrant': 'energetic',
    'cotton-candy': 'dreamy',
    'matcha-latte': 'peaceful',
    'lavender-dream': 'relaxing',
    'sunset-peach': 'romantic',
    'christmas': 'festive',
    'halloween': 'spooky',
    'valentines': 'romantic',
    'spring': 'inspiring'
  };

  // Pre-defined music tracks - using free audio URLs instead of generation
  const musicTracks = {
    'relaxing': 'https://freepd.com/music/Quiet%20Ambient.mp3',
    'ambient': 'https://freepd.com/music/City%20Ambience.mp3',
    'energetic': 'https://freepd.com/music/Chronos.mp3',
    'dreamy': 'https://freepd.com/music/Floating%20Cities.mp3',
    'peaceful': 'https://freepd.com/music/Peaceful%20Chimes.mp3',
    'romantic': 'https://freepd.com/music/Romance.mp3',
    'festive': 'https://freepd.com/music/Jingle%20Bells.mp3',
    'spooky': 'https://freepd.com/music/Haunted.mp3',
    'inspiring': 'https://freepd.com/music/Aspire.mp3'
  };

  const currentMood = themeMoodMap[activeTheme] || 'relaxing';
  const currentTrack = musicTracks[currentMood];
  
  const playerRef = useRef(null);
  
  useEffect(() => {
    // Update volume when it changes
    if (playerRef.current) {
      const audioElement = playerRef.current.audio.current;
      if (audioElement) {
        audioElement.volume = volume;
      }
    }
  }, [volume]);
  
  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };
  
  const onVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  return (
    <div className={`music-player ${isOpen ? 'open' : 'closed'}`}>
      <button 
        className="music-toggle"
        onClick={toggleOpen}
        aria-label={isOpen ? "Close Music Player" : "Open Music Player"}
      >
        {isOpen ? <FaTimes /> : <FaMusic />}
      </button>
      
      {isOpen && (
        <div className="music-container">
          <h3 className="music-title">
            {currentMood.charAt(0).toUpperCase() + currentMood.slice(1)} Music
          </h3>
          
          <div className="music-controls">
            <AudioPlayer
              ref={playerRef}
              src={currentTrack}
              showJumpControls={false}
              layout="stacked-reverse"
              customProgressBarSection={[]}
              customControlsSection={['MAIN_CONTROLS']}
              autoPlayAfterSrcChange={false}
              autoPlay={false}
              style={{ 
                boxShadow: 'none',
                background: 'transparent'
              }}
            />
            
            <div className="volume-control">
              <FaVolumeUp />
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={onVolumeChange}
                className="volume-slider"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MusicPlayer;