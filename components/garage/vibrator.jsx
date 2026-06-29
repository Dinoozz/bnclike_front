"use client";

import { forwardRef, useImperativeHandle } from "react";

const Vibrator = forwardRef(function Vibrator(_, ref) {
  const vibrate = (pattern = [200]) => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(pattern);
      return;
    }

    console.warn("Vibration API non supportee sur cet appareil.");
  };

  useImperativeHandle(ref, () => ({
    vibrate,
  }));

  return null;
});

export default Vibrator;
