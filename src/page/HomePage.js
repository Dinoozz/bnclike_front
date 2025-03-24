import React, { useState, useEffect, useRef } from 'react';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import api from '../api/api';

const HomePage = () => {
  const [isPressedUp, setIsPressedUp] = useState(false);
  const [isAnimatingUp, setIsAnimatingUp] = useState(false);
  const [isUpDisabled, setIsUpDisabled] = useState(false);
  const isPressedDownRef = useRef(false); // Remplace l'état par une référence

  // Gestion du bouton UP
  const handleUpMouseDown = async () => {
    if (isUpDisabled || isAnimatingUp || isPressedUp) return;

    setIsPressedUp(true);
    setIsAnimatingUp(true);
    setIsUpDisabled(true);

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

  const handleUpMouseUp = () => {
    setIsPressedUp(false);
    setIsUpDisabled(false);
  };

  // Gestion du bouton DOWN
  const handleDownMouseDown = async () => {
    if (isPressedDownRef.current) return;

    isPressedDownRef.current = true; // Activer la référence

    while (isPressedDownRef.current) {
      const startTime = Date.now();

      try {
        const response = await api.down();
        console.log('API DOWN response:', response);
      } catch (error) {
        console.error('Error with API DOWN request:', error);
      }

      const elapsedTime = Date.now() - startTime;
      const waitTime = Math.max(200 - elapsedTime, 0); // Modifier à 0,2s

      if (waitTime > 0) {
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  };

  const handleDownMouseUp = () => {
    isPressedDownRef.current = false; // Désactiver la référence
  };

  useEffect(() => {
    window.addEventListener('mouseup', handleUpMouseUp);
    window.addEventListener('touchend', handleUpMouseUp);

    window.addEventListener('mouseup', handleDownMouseUp);
    window.addEventListener('touchend', handleDownMouseUp);

    return () => {
      window.removeEventListener('mouseup', handleUpMouseUp);
      window.removeEventListener('touchend', handleUpMouseUp);

      window.removeEventListener('mouseup', handleDownMouseUp);
      window.removeEventListener('touchend', handleDownMouseUp);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-around min-h-screen bg-gradient-to-br from-gray-800 to-gray-900">

      {/* Conteneur du Titre */}
      <div className="mb-10 px-8 py-4 rounded-lg bg-gray-700 shadow-xl">
        <h1 className="text-4xl font-bold text-white text-center tracking-wider">🚪 Garage Remote</h1>
      </div>

      {/* Conteneur des Boutons */}
      <div className="flex flex-col items-center justify-center space-y-12 p-10 bg-gray-700 rounded-3xl shadow-2xl border border-gray-600">

        {/* Bouton Flèche Haut */}
        <div className="relative flex items-center justify-center">
          {isAnimatingUp && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-32 h-20 rounded-full border-4 border-blue-500 animate-ping"></div>
            </div>
          )}
          <button
            onMouseDown={handleUpMouseDown}
            onTouchStart={handleUpMouseDown}
            onMouseUp={handleUpMouseUp}
            onTouchEnd={handleUpMouseUp}
            disabled={isUpDisabled}
            className={`relative flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-xl 
              ${isUpDisabled ? 'opacity-20 cursor-not-allowed' : 'hover:bg-blue-100 active:bg-blue-200'} 
              transition-all duration-200`}
          >
            <FaArrowUp className="text-4xl text-blue-500" />
          </button>
        </div>

        {/* Bouton Flèche Bas */}
        <div className="relative flex items-center justify-center">
          <button
            onMouseDown={handleDownMouseDown}
            onTouchStart={handleDownMouseDown}
            onMouseUp={handleDownMouseUp}
            onTouchEnd={handleDownMouseUp}
            className="relative flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-xl 
              hover:bg-red-100 active:bg-red-200 transition-all duration-200"
          >
            <FaArrowDown className="text-4xl text-red-500" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;