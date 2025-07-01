import { useState, useRef, useCallback } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface UseCarouselDragProps {
  setRotation: (value: React.SetStateAction<number>) => void;
  setDirection: (value: React.SetStateAction<number>) => void;
}

// Helper for smoothing rotation
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export const useCarouselDrag = ({ setRotation, setDirection }: UseCarouselDragProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const lastPointerXRef = useRef<number | null>(null);
  const pendingRotationRef = useRef<number>(0);
  const isMobile = useIsMobile();

  // Use only pointer events and smooth the rotation updates with lerp
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    setIsDragging(true);
    lastPointerXRef.current = e.clientX;
    // Flush any pending drag motion
    pendingRotationRef.current = 0;
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging || lastPointerXRef.current === null) return;
    e.preventDefault();
    const deltaX = e.clientX - lastPointerXRef.current;
    lastPointerXRef.current = e.clientX;

    // Smooth the drag motion with linear interpolation to avoid abrupt jumps
    pendingRotationRef.current = lerp(pendingRotationRef.current, deltaX, 0.2);

    // Clamp small values to 0 to avoid jitter
    if (Math.abs(pendingRotationRef.current) > 0.1) {
      setRotation((prev) => {
        // Scale factor is -0.15 for mobile and -0.25 for desktop
        const scaleFactor = isMobile ? -0.15 : -0.25;
        return (prev + pendingRotationRef.current * scaleFactor) % 360;
      });
      setDirection(pendingRotationRef.current > 0 ? -1 : 1);
    }
    // Uncomment to debug rotation deltas on iOS
    // console.log('pointerMove', { pending: pendingRotationRef.current, deltaX });
  }, [isDragging, setRotation, setDirection, isMobile]);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    // --- KEY FIX START ---
    // On release, if there's any nonzero pending delta, apply it one last time
    if (Math.abs(pendingRotationRef.current) > 0.02) {
      setRotation((prev) => {
        const scaleFactor = isMobile ? -0.15 : -0.25;
        return (prev + pendingRotationRef.current * scaleFactor) % 360;
      });
      setDirection(pendingRotationRef.current > 0 ? -1 : 1);
    }
    // --- KEY FIX END ---

    setIsDragging(false);
    lastPointerXRef.current = null;
    pendingRotationRef.current = 0;
    // Uncomment to debug drag end on iOS
    // console.log('pointerUp');
  }, [setRotation, setDirection, isMobile]);

  return {
    isDragging,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  };
};
