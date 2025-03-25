// ButtonDown.js
import React, { useRef, useState, useEffect } from 'react';
import { FaArrowDown } from 'react-icons/fa';
import api from '../api/api';

const ButtonDown = () => {
  const isPressedDownRef = useRef(false);
  const [isAnimatingDown, setIsAnimatingDown] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);

  const handleDownMouseDown = async () => {
    if (isPressedDownRef.current || isRequesting) return;

    isPressedDownRef.current = true;
    setIsAnimatingDown(true);
    await sendApiRequest();
  };

  const sendApiRequest = async () => {
    while (isPressedDownRef.current || isRequesting) {
      if (isRequesting) return;

      setIsRequesting(true);
      const startTime = Date.now();

      try {
        const response = await api.down();
        console.log('API DOWN response:', response);
      } catch (error) {
        console.error('Error with API DOWN request:', error);
      }

      const elapsedTime = Date.now() - startTime;
      const waitTime = Math.max(200 - elapsedTime, 0);

      if (waitTime > 0) {
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }

      setIsRequesting(false);
    }
    setIsAnimatingDown(false);
  };

  const handleDownMouseUp = () => {
    isPressedDownRef.current = false;
    setIsAnimatingDown(false);
  };

  useEffect(() => {
    window.addEventListener('mouseup', handleDownMouseUp);
    window.addEventListener('touchend', handleDownMouseUp);

    return () => {
      window.removeEventListener('mouseup', handleDownMouseUp);
      window.removeEventListener('touchend', handleDownMouseUp);
    };
  }, []);

  return (
    <div className="relative flex items-center justify-center">
      {isAnimatingDown && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-32 h-20 rounded-full border-4 border-red-500 animate-ping"></div>
        </div>
      )}
      <button
        onMouseDown={handleDownMouseDown}
        onTouchStart={handleDownMouseDown}
        className="relative flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-xl 
          active:bg-red-200 transition-all duration-200"
      >
        <FaArrowDown className="text-4xl text-red-500" />
      </button>
    </div>
  );
};

export default ButtonDown;
