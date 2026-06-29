"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const HOLD_DURATION = 6000;
const SHOW_BAR_AFTER = 3000;

export default function DualZoneTrigger({ onTrigger }) {
  const leftPressed = useRef(false);
  const rightPressed = useRef(false);
  const bothStartTime = useRef(null);
  const timerRef = useRef(null);
  const barTimerRef = useRef(null);
  const animFrameRef = useRef(null);
  const activeTouches = useRef({ left: new Set(), right: new Set() });

  const [showBar, setShowBar] = useState(false);
  const [progress, setProgress] = useState(0);
  const [triggered, setTriggered] = useState(false);

  const cleanup = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (barTimerRef.current) {
      clearTimeout(barTimerRef.current);
      barTimerRef.current = null;
    }

    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }

    bothStartTime.current = null;
    setShowBar(false);
    setProgress(0);
  }, []);

  const startProgressAnimation = useCallback(() => {
    const barStart = Date.now();
    const remaining = HOLD_DURATION - SHOW_BAR_AFTER;

    const tick = () => {
      const elapsed = Date.now() - barStart;
      const nextProgress = Math.min(elapsed / remaining, 1);

      setProgress(nextProgress);

      if (nextProgress < 1) {
        animFrameRef.current = requestAnimationFrame(tick);
      }
    };

    animFrameRef.current = requestAnimationFrame(tick);
  }, []);

  const checkBothPressed = useCallback(() => {
    if (
      leftPressed.current &&
      rightPressed.current &&
      !bothStartTime.current &&
      !triggered
    ) {
      bothStartTime.current = Date.now();

      barTimerRef.current = window.setTimeout(() => {
        setShowBar(true);
        startProgressAnimation();
      }, SHOW_BAR_AFTER);

      timerRef.current = window.setTimeout(() => {
        setTriggered(true);
        cleanup();
        onTrigger?.();

        window.setTimeout(() => setTriggered(false), 1000);
      }, HOLD_DURATION);
    }
  }, [cleanup, onTrigger, startProgressAnimation, triggered]);

  const handleRelease = useCallback(() => {
    if (bothStartTime.current) {
      cleanup();
    }
  }, [cleanup]);

  const classifySide = (clientX) =>
    clientX < window.innerWidth / 2 ? "left" : "right";

  const handleTouchStart = useCallback(
    (event) => {
      for (const touch of event.changedTouches) {
        const side = classifySide(touch.clientX);
        activeTouches.current[side].add(touch.identifier);
      }

      leftPressed.current = activeTouches.current.left.size > 0;
      rightPressed.current = activeTouches.current.right.size > 0;
      checkBothPressed();
    },
    [checkBothPressed],
  );

  const handleTouchEnd = useCallback(
    (event) => {
      for (const touch of event.changedTouches) {
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
    },
    [handleRelease],
  );

  const handleMouseDown = useCallback(
    (side) => {
      if (side === "left") {
        leftPressed.current = true;
      }

      if (side === "right") {
        rightPressed.current = true;
      }

      checkBothPressed();
    },
    [checkBothPressed],
  );

  const handleMouseUp = useCallback(
    (side) => {
      if (side === "left") {
        leftPressed.current = false;
      }

      if (side === "right") {
        rightPressed.current = false;
      }

      handleRelease();
    },
    [handleRelease],
  );

  useEffect(() => cleanup, [cleanup]);

  return (
    <>
      <div className="absolute inset-0 z-0 flex">
        <div
          className="h-full w-1/2"
          onMouseDown={() => handleMouseDown("left")}
          onMouseUp={() => handleMouseUp("left")}
          onMouseLeave={() => handleMouseUp("left")}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
        />
        <div
          className="h-full w-1/2"
          onMouseDown={() => handleMouseDown("right")}
          onMouseUp={() => handleMouseUp("right")}
          onMouseLeave={() => handleMouseUp("right")}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
        />
      </div>

      {showBar && (
        <div className="fixed right-0 bottom-0 left-0 z-[90] h-2 bg-gray-800">
          <div
            className="h-full bg-red-500 transition-none"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      )}
    </>
  );
}
