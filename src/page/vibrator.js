import React, { useEffect, useImperativeHandle, forwardRef, useRef } from 'react';

const Vibrator = forwardRef((props, ref) => {
  const isReady = useRef(false);

  useEffect(() => {
    if (navigator.vibrate) {
      navigator.vibrate(1); // "initialisation"
    }
    isReady.current = true;
  }, []);

  const vibrate = (pattern = [200]) => {
    if (!isReady.current) {
      console.warn('Vibrator pas encore prêt');
      return;
    }

    if (navigator.vibrate) {
      navigator.vibrate(pattern);
    } else {
      console.warn('Vibration API non supportée sur cet appareil.');
    }
  };

  useImperativeHandle(ref, () => ({
    vibrate,
    isReady: () => isReady.current,
  }));

  return null;
});

export default Vibrator;
