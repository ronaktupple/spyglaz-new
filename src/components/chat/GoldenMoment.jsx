import React, { useEffect, useState } from 'react';
import Lottie from 'lottie-react';
import trophyAnimation from '../../utils/Trophy.json';
import confettiAnimation from '../../utils/Confetti.json';

export const GoldenMoment = ({ isVisible, onComplete }) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [playSound, setPlaySound] = useState(false);

  useEffect(() => {
    if (isVisible) {
      // Play celebration music
      setPlaySound(true);

      // Show confetti after a short delay
      setTimeout(() => {
        setShowConfetti(true);
      }, 500);

      // Show congratulatory message after trophy animation
      setTimeout(() => {
        setShowMessage(true);
      }, 2000);

      // Hide after 5 seconds
      setTimeout(() => {
        setShowConfetti(false);
        setShowMessage(false);
        setPlaySound(false);
        onComplete();
      }, 5000);
    }
  }, [isVisible, onComplete]);

  useEffect(() => {
    if (playSound) {
      // Play celebration sound using the Winning.mp3 file
      playCelebrationSound();
    }
  }, [playSound]);

  const playCelebrationSound = () => {
    try {
      // Create audio context
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();

      // Load and play the LevelCelebrate.mp3 sound file
      fetch('/sounds/LevelCelebrate.mp3')
        .then(response => response.arrayBuffer())
        .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
        .then(audioBuffer => {
          // Play the audio
          const source = audioContext.createBufferSource();
          source.buffer = audioBuffer;
          source.connect(audioContext.destination);
          source.start();
        })
        .catch(error => {
          playCelebrationSoundFallback();
        });

    } catch (error) {
      playCelebrationSoundFallback();
    }
  };

  const playCelebrationSoundFallback = () => {
    try {
      // Load and execute the celebration.js script
      const script = document.createElement('script');
      script.src = '/sounds/celebration.js';
      script.onload = () => {
        // Call the celebration sound function
        if (window.createCelebrationSound) {
          window.createCelebrationSound();
        } else {
          // Fallback to basic sound if celebration function not available
          playBasicFallbackSound();
        }
      };
      script.onerror = () => {
        playBasicFallbackSound();
      };
      document.head.appendChild(script);
    } catch (error) {
      playBasicFallbackSound();
    }
  };

  const playBasicFallbackSound = () => {
    // Create and play the "ding" sound as basic fallback
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.setValueAtTime(800, audioContext.currentTime); // 800Hz for "ding"
    oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.3); // Slide down

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  };

  if (!isVisible) return null;

  return (
    <div className="relative z-40 flex items-center justify-center pointer-events-none border-0 outline-none">
      {/* Trophy Animation - Compact and above chat input */}
      <div className="relative z-10 flex items-center justify-center border-0 outline-none">
        <div className="w-24 h-24 flex items-center justify-center trophy-bounce border-0 outline-none">
          <Lottie
            animationData={trophyAnimation}
            loop={false}
            autoplay={true}
            className="w-full h-full object-contain border-0 outline-none"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height:"200px",
              width:"200px",
              border: 'none',
              outline: 'none'
            }}
          />
        </div>
      </div>

      {/* Confetti - Compact and positioned around trophy */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none border-0 outline-none">
          <Lottie
            animationData={confettiAnimation}
            loop={false}
            autoplay={true}
            className="w-28 h-28 object-contain border-0 outline-none"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: 'none',
              outline: 'none'
            }}
          />
        </div>
      )}

    

      {/* Glow Effect - Compact and localized */}
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/15 via-orange-400/15 to-yellow-400/15 animate-pulse pointer-events-none border-0 outline-none rounded-full w-28 h-28" />
    </div>
  );
};
