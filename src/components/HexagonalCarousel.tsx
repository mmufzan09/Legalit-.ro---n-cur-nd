import React, { useRef, useState, useEffect, useCallback } from "react";
import { features } from "@/data/features";
import { useIsMobile } from "@/hooks/use-mobile";
import { useCarouselAnimation } from "@/hooks/useCarouselAnimation";
import { useCarouselDrag } from "@/hooks/useCarouselDrag";
import { getCardPosition } from "@/utils/carouselUtils";
import { HexagonCard } from "@/components/HexagonCard";


export const HexagonalCarousel: React.FC = () => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const [rotationSpeed, setRotationSpeed] = useState(0);
  const prevRotationRef = useRef(0);

  const [rotation, setRotation, direction, setDirection, animationHook] = useCarouselAnimation();

  const {
    isDragging,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  } = useCarouselDrag({ setRotation, setDirection });

  // ➤ Rotation speed tracking
  useEffect(() => {
    const currentRotation = rotation;
    const rotationDelta = Math.abs(currentRotation - prevRotationRef.current);
    const normalizedDelta = rotationDelta > 180 ? 360 - rotationDelta : rotationDelta;
    setRotationSpeed(normalizedDelta);
    prevRotationRef.current = currentRotation;
  }, [rotation]);

  // ➤ Update dragging state in animation hook
  useEffect(() => {
    animationHook.updateDraggingState(isDragging);
  }, [isDragging, animationHook]);

  // ➤ Carousel settings
  const radius = isMobile ? 200 : 360;
  const dragAreaSize = radius * (isMobile ? 1.5 : 1);
  const mobileTransform = isMobile ? "translateY(-55px)" : "translateY(-5px)";
  const cardSize = isMobile ? 75 : 98;

  // ➤ Only show limited features on mobile
  const visibleFeatures = isMobile ? features.slice(0, 6) : features;

  // ➤ All card positions
  const allPositions = visibleFeatures.map((_, index) => ({
    index,
    position: getCardPosition(index, rotation, isMobile),
  }));

  // ➤ Throttled pointer move handler for smooth dragging
  const throttledPointerMove = useCallback(handlePointerMove, 16);

  // ➤ Drag area style
  const dragAreaStyle: React.CSSProperties = {
    width: `${dragAreaSize}px`,
    height: `${dragAreaSize}px`,
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
    transform: `${mobileTransform} translateZ(0)`, // ➤ Force GPU acceleration
    willChange: "transform", // ➤ Optimize rendering
  };

  return (
    <div
      className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-visible"
      style={{ zIndex: 5 }}
    >
      /* ➤ Drag Area */
      <div
        ref={carouselRef}
        className="select-none pointer-events-auto"
        onPointerDown={handlePointerDown}
        onPointerMove={throttledPointerMove}
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
