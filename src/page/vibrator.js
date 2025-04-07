// Vibrator.js
import React, { useEffect, useImperativeHandle, forwardRef } from 'react';

const Vibrator = forwardRef((props, ref) => {
  // Initialisation de l'API de vibration au montage du composant
  useEffect(() => {
    if (navigator.vibrate) {
      navigator.vibrate(1); // Mini vibration pour activer l'API
    }
  }, []);

  const vibrate = (pattern = [200]) => {
    if (navigator.vibrate) {
      navigator.vibrate(pattern);
    } else {
      console.warn('Vibration API non supportée sur cet appareil.');
    }
  };

  useImperativeHandle(ref, () => ({
    vibrate,
  }));

  return null;
});

export default Vibrator;
