// Vibrator.js
import { useImperativeHandle, forwardRef } from 'react';

const Vibrator = forwardRef((props, ref) => {

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
