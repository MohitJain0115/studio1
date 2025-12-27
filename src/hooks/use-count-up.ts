"use client";

import { useState, useEffect, useRef } from "react";

const easeOutExpo = (t: number): number => {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
};

export function useCountUp(
  endValue: number,
  duration: number = 2000,
  decimalPlaces: number = 2
) {
  const [count, setCount] = useState(0);
  const frameRate = 1000 / 60;
  const totalFrames = Math.round(duration / frameRate);
  const animationFrameId = useRef<number | null>(null);
  const startTimestamp = useRef<number | null>(null);

  useEffect(() => {
    // Reset and start animation
    setCount(0);
    startTimestamp.current = null;

    const animate = (timestamp: number) => {
      if (!startTimestamp.current) {
        startTimestamp.current = timestamp;
      }

      const progress = timestamp - startTimestamp.current;
      const progressFraction = Math.min(progress / duration, 1);
      const easedProgress = easeOutExpo(progressFraction);
      const currentValue = easedProgress * endValue;

      // Only update if the rounded value has changed
      const roundedValue = parseFloat(currentValue.toFixed(decimalPlaces));
      setCount((prevCount) => {
        if (prevCount !== roundedValue) {
          return roundedValue;
        }
        return prevCount;
      });

      if (progress < duration) {
        animationFrameId.current = requestAnimationFrame(animate);
      } else {
        setCount(parseFloat(endValue.toFixed(decimalPlaces)));
      }
    };

    animationFrameId.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [endValue, duration, decimalPlaces]);

  return count.toFixed(decimalPlaces);
}

    