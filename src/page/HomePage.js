// HomePage.js
import React, { useEffect, useState } from 'react';
import ButtonUp from './buttonUp';
import ButtonDown from './buttonDown';
import StatusInfo from './statusInfo'; // Assurez-vous que le chemin est correct

const HomePage = () => {

  // ici créer une liste d'url pour l'api et une variable activeurl, ces urls pourront être selectionner dans le composant status pour savoir lequel utiliser lors des requetes des autres composant :
  const apiUrls = {
    rasp: 'http://rasp:5000',
    raspberrypi: 'http://raspberrypi.local:5000',
    local_Ip: 'http://192.168.1.113:5000',
  };

  const [activeUrl, setActiveUrl] = useState(apiUrls.local_Ip);

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

  // Optionally, set a default activeUrl after mount
  useEffect(() => {
    setActiveUrl(apiUrls.local_Ip);
  }, []);

  if (!activeUrl) return null;

  return (
    <div className="flex flex-col items-center justify-around min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 max-h-100vh select-none">
      <StatusInfo apiUrls={apiUrls} activeUrl={activeUrl} setActiveUrl={setActiveUrl} />
          {/* Conteneur du Titre */}
          <div className="mb-10 px-8 py-4 rounded-lg bg-gray-700 shadow-xl">
            <h1 className="text-4xl font-bold text-white text-center tracking-wider select-none">🚪 Garage Remote</h1>
          </div>

          {/* Conteneur des Boutons */}
          <div className="flex flex-col items-center justify-center space-y-12 p-10 bg-gray-700 rounded-3xl shadow-2xl border border-gray-600">
      <ButtonUp activeUrl={activeUrl} />
      <ButtonDown activeUrl={activeUrl} />
      </div>
    </div>
  );
};

export default HomePage;