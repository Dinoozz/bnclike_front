// ButtonUp.js
import React, { useState, useRef } from 'react';
import { FaArrowUp } from 'react-icons/fa';
import api from '../api/api';
import Vibrator from './vibrator'; // Chemin à adapter si nécessaire

const ButtonUp = () => {
  const [isPressedUp, setIsPressedUp] = useState(false);
  const [isAnimatingUp, setIsAnimatingUp] = useState(false);
  const [isUpDisabled, setIsUpDisabled] = useState(false);

  const vibratorRef = useRef(null);

  const handleUpMouseDown = async () => {
    if (isUpDisabled || isAnimatingUp || isPressedUp) return;

    setIsPressedUp(true);
    setIsAnimatingUp(true);
    setIsUpDisabled(true);

    // Déclenche la vibration si disponible
    if (vibratorRef.current) {
      vibratorRef.current.vibrate([100, 50, 100]); // Ex : double vibration
    }

    try {
      const response = await api.up();
      console.log('API UP response:', response);
    } catch (error) {
      console.error('Error with API UP request:', error);
    }

    setTimeout(() => {
      setIsAnimatingUp(false);
      setIsPressedUp(false);
      setIsUpDisabled(false);
    }, 850);
  };

  return (
    <>
      <Vibrator ref={vibratorRef} />
      <div className="relative flex items-center justify-center select-none">
        {isAnimatingUp && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
            <div className="w-32 h-20 rounded-full border-4 border-blue-500 animate-ping"></div>
          </div>
        )}
        <button
          onMouseDown={handleUpMouseDown}
          onTouchStart={handleUpMouseDown}
          disabled={isUpDisabled}
          className={`relative flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-xl select-none
            ${isUpDisabled ? 'opacity-20 cursor-not-allowed' : ' active:bg-blue-200'}
            transition-all duration-200`}
        >
          <FaArrowUp className="text-4xl text-blue-500 select-none" />
        </button>
      </div>
    </>
  );
};

export default ButtonUp;