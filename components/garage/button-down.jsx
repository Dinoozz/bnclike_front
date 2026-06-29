"use client";

import { ArrowDown } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { sendGarageCommand } from "@/components/garage/garage-client";
import Vibrator from "@/components/garage/vibrator";
import { Button } from "@/components/ui/button";

export default function ButtonDown() {
  const isPressedDownRef = useRef(false);
  const isRequestingRef = useRef(false);
  const vibratorRef = useRef(null);

  const [isAnimatingDown, setIsAnimatingDown] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);

  const vibrate = () => {
    if (vibratorRef.current) {
      vibratorRef.current.vibrate([30]);
      return;
    }

    window.setTimeout(() => vibratorRef.current?.vibrate([30]), 50);
  };

  const sendApiLoop = useCallback(async () => {
    if (isRequestingRef.current) {
      return;
    }

    while (isPressedDownRef.current) {
      vibrate();
      isRequestingRef.current = true;
      setIsRequesting(true);

      const startTime = Date.now();

      try {
        const response = await sendGarageCommand("close");
        console.log("API DOWN response:", response);
      } catch (error) {
        console.error("Error with API DOWN request:", error);
      }

      const elapsedTime = Date.now() - startTime;
      const waitTime = Math.max(200 - elapsedTime, 0);

      if (waitTime > 0) {
        await new Promise((resolve) => window.setTimeout(resolve, waitTime));
      }

      isRequestingRef.current = false;
      setIsRequesting(false);
    }

    setIsAnimatingDown(false);
  }, []);

  const handleDownMouseDown = () => {
    if (isPressedDownRef.current || isRequesting) {
      return;
    }

    isPressedDownRef.current = true;
    setIsAnimatingDown(true);
    sendApiLoop();
  };

  const handleDownMouseUp = useCallback(() => {
    isPressedDownRef.current = false;
    setIsAnimatingDown(false);
  }, []);

  useEffect(() => {
    window.addEventListener("mouseup", handleDownMouseUp);
    window.addEventListener("touchend", handleDownMouseUp);

    return () => {
      window.removeEventListener("mouseup", handleDownMouseUp);
      window.removeEventListener("touchend", handleDownMouseUp);
    };
  }, [handleDownMouseUp]);

  return (
    <>
      <Vibrator ref={vibratorRef} />
      <div className="relative flex items-center justify-center select-none">
        {isAnimatingDown && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center select-none">
            <div className="h-20 w-32 animate-ping rounded-full border-4 border-red-500" />
          </div>
        )}
        <Button
          type="button"
          onMouseDown={handleDownMouseDown}
          onTouchStart={handleDownMouseDown}
          className="relative flex h-20 w-20 items-center justify-center rounded-full bg-white text-red-500 shadow-xl transition-all duration-200 select-none hover:bg-white active:bg-red-200"
        >
          <ArrowDown className="size-10 select-none" strokeWidth={3} />
        </Button>
      </div>
    </>
  );
}
