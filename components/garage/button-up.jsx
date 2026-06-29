"use client";

import { ArrowUp } from "lucide-react";
import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { sendGarageCommand } from "@/components/garage/garage-client";
import Vibrator from "@/components/garage/vibrator";

export default function ButtonUp() {
  const [isPressedUp, setIsPressedUp] = useState(false);
  const [isAnimatingUp, setIsAnimatingUp] = useState(false);
  const [isUpDisabled, setIsUpDisabled] = useState(false);
  const vibratorRef = useRef(null);

  const vibrate = () => {
    if (vibratorRef.current) {
      vibratorRef.current.vibrate([400]);
      return;
    }

    window.setTimeout(() => vibratorRef.current?.vibrate([400]), 50);
  };

  const handleUpMouseDown = async () => {
    if (isUpDisabled || isAnimatingUp || isPressedUp) {
      return;
    }

    vibrate();
    setIsPressedUp(true);
    setIsAnimatingUp(true);
    setIsUpDisabled(true);

    try {
      const response = await sendGarageCommand("open");
      console.log("API UP response:", response);
    } catch (error) {
      console.error("Error with API UP request:", error);
    }

    window.setTimeout(() => {
      setIsAnimatingUp(false);
      setIsPressedUp(false);
      setIsUpDisabled(false);
    }, 850);
  };

  return (
    <>
      <Vibrator ref={vibratorRef} />
      <div className="relative flex items-center justify-center select-none">
        {isAnimatingUp && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center select-none">
            <div className="h-20 w-32 animate-ping rounded-full border-4 border-blue-500" />
          </div>
        )}
        <Button
          type="button"
          onMouseDown={handleUpMouseDown}
          onTouchStart={handleUpMouseDown}
          disabled={isUpDisabled}
          className={`relative flex h-20 w-20 items-center justify-center rounded-full bg-white text-blue-500 shadow-xl transition-all duration-200 select-none hover:bg-white ${
            isUpDisabled ? "cursor-not-allowed opacity-20" : "active:bg-blue-200"
          }`}
        >
          <ArrowUp className="size-10 select-none" strokeWidth={3} />
        </Button>
      </div>
    </>
  );
}
