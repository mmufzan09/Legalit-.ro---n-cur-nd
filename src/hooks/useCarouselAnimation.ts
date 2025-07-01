
import { useEffect, useState, useRef, useCallback } from "react";

export const useCarouselAnimation = () => {
  const [rotation, setRotation] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const animationRef = useRef<number>();

  useEffect(() => {
    // Random initial direction
    setDirection(Math.random() > 0.5 ? 1 : -1);
  }, []);

  useEffect(() => {
    // Only animate when not dragging
    if (!isDragging) {
      const animate = () => {
        setRotation(prev => prev + direction * 0.05); // Changed back from 50 to 0.05 (1000x slower)
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [direction, isDragging]);

  const updateDraggingState = useCallback((dragging: boolean) => {
    setIsDragging(dragging);
  }, []);

  const animationHook = {
    updateDraggingState
  };

  return [rotation, setRotation, direction, setDirection, animationHook] as const;
};
