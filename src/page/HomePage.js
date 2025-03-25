// HomePage.js
import React, { useEffect } from 'react';
import ButtonUp from './buttonUp';
import ButtonDown from './buttonDown';

const HomePage = () => {
  // const handleGlobalMouseUp = () => {
  //   window.dispatchEvent(new Event('mouseup'));
  // };

  // useEffect(() => {
  //   window.addEventListener('mouseup', handleGlobalMouseUp);
  //   window.addEventListener('touchend', handleGlobalMouseUp);

  //   return () => {
  //     window.removeEventListener('mouseup', handleGlobalMouseUp);
  //     window.removeEventListener('touchend', handleGlobalMouseUp);
  //   };
  // }, []);

  return (
    <div className="flex flex-col items-center justify-around min-h-screen bg-gradient-to-br from-gray-800 to-gray-900">

      {/* Conteneur du Titre */}
      <div className="mb-10 px-8 py-4 rounded-lg bg-gray-700 shadow-xl">
        <h1 className="text-4xl font-bold text-white text-center tracking-wider">🚪 Garage Remote</h1>
      </div>

      {/* Conteneur des Boutons */}
      <div className="flex flex-col items-center justify-center space-y-12 p-10 bg-gray-700 rounded-3xl shadow-2xl border border-gray-600">
        <ButtonUp />
        <ButtonDown />
      </div>

    </div>
  );
};

export default HomePage;