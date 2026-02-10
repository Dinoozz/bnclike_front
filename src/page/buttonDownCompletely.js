// ButtonDownCompletely.js
// Composant "caché" : un simple span cliquable qui déclenche api.down_completely
// Il s'utilise en wrappant du contenu (ex: un emoji) sans aucun style de bouton visible.
import React, { useState } from 'react';
import api from '../api/api';

const ButtonDownCompletely = ({ activeUrl, children }) => {
  const [isRequesting, setIsRequesting] = useState(false);

  const handleClick = async () => {
    if (isRequesting) return;
    setIsRequesting(true);

    try {
      const response = await api.down_completely(activeUrl);
      console.log('API DOWN_COMPLETELY response:', response);
    } catch (error) {
      console.error('Error with API DOWN_COMPLETELY request:', error);
    }

    setIsRequesting(false);
  };

  return (
    <span
      onClick={handleClick}
      className={`cursor-pointer select-none transition-opacity duration-200 ${
        isRequesting ? 'opacity-40' : 'opacity-100'
      }`}
    >
      {children}
    </span>
  );
};

export default ButtonDownCompletely;