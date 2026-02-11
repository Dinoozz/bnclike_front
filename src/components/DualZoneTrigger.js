// DualZoneTrigger.js
// Divise le background en deux zones (gauche/droite).
// Appuyer simultanément des deux côtés pendant 6s déclenche l'action.
// Une barre de progression apparaît après 3s de pression.
import React, { useRef, useState, useCallback, useEffect } from 'react';

const HOLD_DURATION = 6000;   // durée totale requise
const SHOW_BAR_AFTER = 3000;  // barre visible après 3s

const DualZoneTrigger = ({ onTrigger }) => {
  const leftPressed = useRef(false);
  const rightPressed = useRef(false);
  const bothStartTime = useRef(null);
  const timerRef = useRef(null);
  const barTimerRef = useRef(null);
  const animFrameRef = useRef(null);

  const [showBar, setShowBar] = useState(false);
  const [progress, setProgress] = useState(0);  // 0..1 (relative à la partie 3s→6s)
  const [triggered, setTriggered] = useState(false);

  const cleanup = useCallback(() => {
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
    if (barTimerRef.current) { clearTimeout(barTimerRef.current); barTimerRef.current = null; }
    if (animFrameRef.current) { cancelAnimationFrame(animFrameRef.current); animFrameRef.current = null; }
    bothStartTime.current = null;
    setShowBar(false);
    setProgress(0);
  }, []);

  const startProgressAnimation = useCallback(() => {
    const barStart = Date.now();
    const remaining = HOLD_DURATION - SHOW_BAR_AFTER; // 3000ms

    const tick = () => {
      const elapsed = Date.now() - barStart;
      const p = Math.min(elapsed / remaining, 1);
      setProgress(p);
      if (p < 1) {
        animFrameRef.current = requestAnimationFrame(tick);
      }
    };
    animFrameRef.current = requestAnimationFrame(tick);
  }, []);

  const checkBothPressed = useCallback(() => {
    if (leftPressed.current && rightPressed.current && !bothStartTime.current && !triggered) {
      bothStartTime.current = Date.now();

      // Après 3s, montrer la barre
      barTimerRef.current = setTimeout(() => {
        setShowBar(true);
        startProgressAnimation();
      }, SHOW_BAR_AFTER);

      // Après 6s, trigger
      timerRef.current = setTimeout(() => {
        setTriggered(true);
        cleanup();
        if (onTrigger) onTrigger();
        // Reset triggered après un petit délai pour permettre re-utilisation
        setTimeout(() => setTriggered(false), 1000);
      }, HOLD_DURATION);
    }
  }, [triggered, onTrigger, cleanup, startProgressAnimation]);

  const handleRelease = useCallback(() => {
    // Si l'un des deux côtés relâche, annuler
    if (bothStartTime.current) {
      cleanup();
    }
  }, [cleanup]);

  // --- Gestion tactile multi-touch ---
  const activeTouches = useRef({ left: new Set(), right: new Set() });

  const classifySide = (clientX) => {
    return clientX < window.innerWidth / 2 ? 'left' : 'right';
  };

  const handleTouchStart = useCallback((e) => {
    for (const touch of e.changedTouches) {
      const side = classifySide(touch.clientX);
      activeTouches.current[side].add(touch.identifier);
    }
    leftPressed.current = activeTouches.current.left.size > 0;
    rightPressed.current = activeTouches.current.right.size > 0;
    checkBothPressed();
  }, [checkBothPressed]);

  const handleTouchEnd = useCallback((e) => {
    for (const touch of e.changedTouches) {
      activeTouches.current.left.delete(touch.identifier);
      activeTouches.current.right.delete(touch.identifier);
    }
    const wasLeft = leftPressed.current;
    const wasRight = rightPressed.current;
    leftPressed.current = activeTouches.current.left.size > 0;
    rightPressed.current = activeTouches.current.right.size > 0;

    if ((wasLeft && !leftPressed.current) || (wasRight && !rightPressed.current)) {
      handleRelease();
    }
  }, [handleRelease]);

  // --- Gestion souris (pour test desktop) ---
  const handleMouseDown = useCallback((e, side) => {
    if (side === 'left') leftPressed.current = true;
    if (side === 'right') rightPressed.current = true;
    checkBothPressed();
  }, [checkBothPressed]);

  const handleMouseUp = useCallback((e, side) => {
    if (side === 'left') leftPressed.current = false;
    if (side === 'right') rightPressed.current = false;
    handleRelease();
  }, [handleRelease]);

  // Cleanup global au démontage
  useEffect(() => {
    return () => cleanup();
  }, [cleanup]);

  return (
    <>
      {/* Deux zones invisibles en position absolue couvrant tout le background */}
      <div className="absolute inset-0 z-0 flex">
        {/* Zone gauche */}
        <div
          className="w-1/2 h-full"
          onMouseDown={(e) => handleMouseDown(e, 'left')}
          onMouseUp={(e) => handleMouseUp(e, 'left')}
          onMouseLeave={(e) => handleMouseUp(e, 'left')}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
        />
        {/* Zone droite */}
        <div
          className="w-1/2 h-full"
          onMouseDown={(e) => handleMouseDown(e, 'right')}
          onMouseUp={(e) => handleMouseUp(e, 'right')}
          onMouseLeave={(e) => handleMouseUp(e, 'right')}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
        />
      </div>

      {/* Barre de progression – apparait après 3s, dure 3s */}
      {showBar && (
        <div className="fixed bottom-0 left-0 right-0 z-[90] h-2 bg-gray-800">
          <div
            className="h-full bg-red-500 transition-none"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      )}
    </>
  );
};

export default DualZoneTrigger;
