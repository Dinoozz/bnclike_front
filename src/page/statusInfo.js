import React, { useState, useEffect } from 'react';
import api from '../api/api'; // Assurez-vous que api est bien importé depuis le bon chemin

const Info = () => {
  const [status, setStatus] = useState(null); // Etat de la lumière : null, 'green', 'red'
  
  const checkStatus = async () => {
    setStatus(null); // Indique que la requête est en cours
    try {
      const response = await api.status();
      if (response) {
        setStatus('green'); // Si la réponse est reçue, la lumière devient verte
        setTimeout(checkStatus, 60000); // Nouvelle requête après 1 minute
      } else {
        throw new Error('No response');
      }
    } catch (error) {
      setStatus('red'); // Si pas de réponse, la lumière devient rouge
      setTimeout(checkStatus, 10000); // Nouvelle requête après 10 secondes
    }
  };

  useEffect(() => {
    checkStatus(); // Lancer le premier check au démarrage du composant
  }, []);
  
  return (
    <div className="inline-flex items-center space-x-4 px-4 py-2 bg-gray-700 rounded-lg shadow-md border border-gray-600 w-fit fixed top-4 right-4 z-50">
      <span className="text-white font-medium">
        {status === 'green' ? 'Connecté' : status === 'red' ? 'Non connecté' : '...'}
      </span>
      <div className="w-8 h-8 flex items-center justify-center cursor-pointer" onClick={checkStatus}>
        <div
          className={`w-8 h-8 rounded-full ${
            status === 'green'
              ? 'bg-green-500'
              : status === 'red'
              ? 'bg-red-500'
              : 'bg-gray-500'
          } flex items-center justify-center`}
        >
          {status === null && (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Info;