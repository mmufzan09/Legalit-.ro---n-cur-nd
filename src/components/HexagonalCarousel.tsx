// HexagonalCarousel.tsx
import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { features } from "@/data/features";
import { useIsMobile } from "@/hooks/use-mobile";
import { useCarouselAnimation } from "@/hooks/useCarouselAnimation";
import { useCarouselDrag } from "@/hooks/useCarouselDrag";
import { getCardPosition } from "@/utils/carouselUtils";
import { HexagonCard } from "@/components/HexagonCard";

interface PointerLike {
  clientX: number;
  clientY: number;
  pointerId?: number;
  pointerType?: string;
  preventDefault: () => void;
}

export const HexagonalCarousel: React.FC = () => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const [rotationSpeed, setRotationSpeed] = useState(0);
  const prevRotationRef = useRef(0);
  const touchIdRef = useRef<number | null>(null);
  const lastMoveTimeRef = useRef(0);

  const [rotation, setRotation, direction, setDirection, animationHook] =
    useCarouselAnimation();

  const {
    isDragging,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  } = useCarouselDrag({
    setRotation,
    setDirection,
    sensitivity: isMobile ? 1.8 : 1,
  });

  useEffect(() => {
    const currentRotation = rotation;
    const rotationDelta = Math.abs(currentRotation - prevRotationRef.current);
    const normalizedDelta =
      rotationDelta > 180 ? 360 - rotationDelta : rotationDelta;
    setRotationSpeed(normalizedDelta);
    prevRotationRef.current = currentRotation;
  }, [rotation]);

  useEffect(() => {
    animationHook.updateDraggingState(isDragging);
  }, [isDragging, animationHook]);

  const radius = isMobile ? 200 : 360;
  const dragAreaSize = radius * (isMobile ? 1.5 : 1);
  const mobileTransform = isMobile ? "translateY(-55px)" : "translateY(-5px)";
  const cardSize = isMobile ? 75 : 98;
  const visibleFeatures = isMobile ? features.slice(0, 6) : features;

  const allPositions = useMemo(() => {
    return visibleFeatures.map((_, index) => ({
      index,
      position: getCardPosition(index, rotation, isMobile),
    }));
  }, [visibleFeatures, rotation, isMobile]);

  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      if (touchIdRef.current !== null) return;

      const touch = e.touches[0];
      touchIdRef.current = touch.identifier;

      const syntheticEvent: PointerLike = {
        clientX: touch.clientX,
        clientY: touch.clientY,
        pointerId: touch.identifier,
        pointerType: "touch",
        preventDefault: () => e.preventDefault(),
      };

      handlePointerDown(syntheticEvent);
      e.preventDefault();
    },
    [handlePointerDown]
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      const now = performance.now();
      if (now - lastMoveTimeRef.current < 16) return;

      lastMoveTimeRef.current = now;

      const touch = Array.from(e.changedTouches).find(
        (t) => t.identifier === touchIdRef.current
      );
      if (!touch) return;

      const syntheticEvent: PointerLike = {
        clientX: touch.clientX,
        clientY: touch.clientY,
        pointerId: touch.identifier,
        pointerType: "touch",
        preventDefault: () => e.preventDefault(),
      };

      handlePointerMove(syntheticEvent);
      e.preventDefault();
    },
    [handlePointerMove]
  );

  const handleTouchEnd = useCallback(
    (e: TouchEvent) => {
      const touch = Array.from(e.changedTouches).find(
        (t) => t.identifier === touchIdRef.current
      );
      if (!touch) return;

      const syntheticEvent: PointerLike = {
        clientX: 0,
        clientY: 0,
        pointerId: touch.identifier,
        pointerType: "touch",
        preventDefault: () => e.preventDefault(),
      };

      handlePointerUp(syntheticEvent);
      touchIdRef.current = null;
      e.preventDefault();
    },
    [handlePointerUp]
  );

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;

    const options = { passive: false };

    el.addEventListener("touchstart", handleTouchStart, options);
    el.addEventListener("touchmove", handleTouchMove, options);
    el.addEventListener("touchend", handleTouchEnd, options);
    el.addEventListener("touchcancel", handleTouchEnd, options);

    return () => {
      el.removeEventListener("touchstart", handleTouchStart);
      el.removeEventListener("touchmove", handleTouchMove);
      el.removeEventListener("touchend", handleTouchEnd);
      el.removeEventListener("touchcancel", handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  const dragAreaStyle: React.CSSProperties = {
    width: "100vw",
    maxWidth: isMobile ? "320px" : "560px",
    height: "100%",
    maxHeight: isMobile ? "320px" : "560px",
    touchAction: "none",
    zIndex: 5,
    cursor: isDragging ? "grabbing" : "grab",
    userSelect: "none",
    WebkitUserSelect: "none",
    WebkitTouchCallout: "none",
    WebkitTapHighlightColor: "transparent",
    MozUserSelect: "none",
    msUserSelect: "none",
    overflow: "visible",
    position: "relative",
    left: isMobile ? 0 : "40px",
    transform: `${mobileTransform} translateZ(0)`,
    willChange: "transform",
    contain: "strict",
    backfaceVisibility: "hidden",
    perspective: "1000px",
    WebkitOverflowScrolling: "touch",
    overscrollBehavior: "contain",
    WebkitTransform: "translateZ(0)",
  };

  return (
    <div
      className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-visible"
      style={{ zIndex: 5 }}
    >
      <div
        ref={carouselRef}
        className="select-none pointer-events-auto"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        style={dragAreaStyle}
      >
        <div className="relative w-full h-full flex items-center justify-center">
          {allPositions.map(({ index, position }) => {
            const feature = visibleFeatures[index];
            return (
              <HexagonCard
                key={index}
                feature={feature}
                index={index}
                position={position}
                cardSize={cardSize}
                rotationSpeed={rotationSpeed}
                isMobile={isMobile}
                allPositions={allPositions}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
