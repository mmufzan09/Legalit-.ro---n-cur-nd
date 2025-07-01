import React from "react";
import { createHexagonPath, extractGradientColors } from "@/utils/carouselUtils";
import { Feature } from "@/components/FeatureCard";

interface HexagonCardProps {
  feature: Feature;
  index: number;
  position: {
    x: number;
    y: number;
    z: number;
    scale: number;
    opacity: number;
    cyclePosition: number;
    zIndex: number;
    depthFactor: number;
  };
  cardSize: number;
  rotationSpeed: number;
  isMobile: boolean;
  allPositions: Array<{
    index: number;
    position: {
      x: number;
      y: number;
      z: number;
      scale: number;
      opacity: number;
      cyclePosition: number;
      zIndex: number;
      depthFactor: number;
    };
  }>;
}

export const HexagonCard: React.FC<HexagonCardProps> = ({
  feature,
  index,
  position,
  cardSize,
  rotationSpeed,
  isMobile,
  allPositions
}) => {
  const { fromColor, toColor } = extractGradientColors(feature.color);
  
  // Fixed border width - no dynamic calculation
  const borderWidth = 2.5;

  // Enhanced blur calculation based on cyclePosition
  const getBlurAmount = (cyclePosition: number) => {
    if (cyclePosition > 0.9) {
      // Main card - completely clear
      return 0;
    } else if (cyclePosition > 0.6) {
      // Cards transitioning to center - gradual blur reduction
      const transitionProgress = (cyclePosition - 0.6) / 0.3;
      return 3 * (1 - transitionProgress);
    } else {
      // Side/back cards - strong blur to make text unreadable
      return 4;
    }
  };

  // NEW: Calculate fade transition opacity based on overlapping tiles
  const calculateFadeOpacity = () => {
    const currentPos = position;
    let fadeOpacity = currentPos.opacity;
    
    // Check for overlapping tiles and apply fade transitions
    for (const other of allPositions) {
      if (other.index === index) continue;
      
      const otherPos = other.position;
      
      // Calculate distance between tiles (considering their positions)
      const dx = currentPos.x - otherPos.x;
      const dy = currentPos.y - otherPos.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Define overlap threshold based on card size and scale
      const overlapThreshold = cardSize * Math.max(currentPos.scale, otherPos.scale) * 0.8;
      
      if (distance < overlapThreshold) {
        // Tiles are overlapping - calculate fade based on depth difference
        const depthDifference = Math.abs(currentPos.depthFactor - otherPos.depthFactor);
        
        // If depth difference is small, apply fade transition
        if (depthDifference < 0.3) {
          // Calculate fade factor based on relative depth positions
          const fadeTransition = depthDifference / 0.3; // 0 = same depth, 1 = max difference
          
          // If this tile is behind the other, reduce its opacity more aggressively
          if (currentPos.depthFactor < otherPos.depthFactor) {
            const fadeReduction = (1 - fadeTransition) * 0.7; // Up to 70% reduction
            fadeOpacity *= (1 - fadeReduction);
          } else {
            // If this tile is in front, reduce opacity slightly for smooth transition
            const fadeReduction = (1 - fadeTransition) * 0.3; // Up to 30% reduction
            fadeOpacity *= (1 - fadeReduction);
          }
        }
      }
    }
    
    return Math.max(0, Math.min(1, fadeOpacity));
  };

  const blurAmount = getBlurAmount(position.cyclePosition);
  const finalOpacity = calculateFadeOpacity(); // NEW: Use fade-adjusted opacity

  // Fixed icon and text sizes - these will scale with the CSS transform only
  const iconSize = isMobile ? 20 : 24; // Increased from 20 to 24 for desktop
  const fontSize = isMobile ? 11 : 13; // Increased from 11 to 13 for desktop

  // Calculate dynamic transition duration based on rotation speed
  const calculateTransitionDuration = (speed: number) => {
    // For speeds above 1, use shorter durations
    // For normal speeds (around 0.05-0.1), use 700ms
    // For very high speeds (50+), use 50ms minimum
    const baseSpeed = 0.1; // Normal rotation speed reference
    const baseDuration = 700; // Normal transition duration in ms
    const minDuration = 50; // Minimum duration for very fast rotations
    
    if (speed <= baseSpeed) {
      return baseDuration;
    }
    
    // Scale duration inversely with speed
    const scaledDuration = baseDuration * (baseSpeed / speed);
    return Math.max(minDuration, scaledDuration);
  };

  const transitionDuration = calculateTransitionDuration(Math.abs(rotationSpeed));

  // SVG dimensions - larger container for desktop to prevent clipping
  const svgSize = isMobile ? 150 : 250; // Increased container size for desktop to accommodate larger scaled hexagons

  return (
    <div
      className="absolute ease-out"
      style={{
        transform: `translate(${position.x}px, ${position.y}px) scale(${position.scale})`,
        zIndex: Math.round(position.zIndex),
        opacity: finalOpacity, // NEW: Use fade-adjusted opacity
        filter: `blur(${blurAmount}px)`,
        transition: `all ${transitionDuration}ms ease-out`,
      }}
    >
      <div className="relative">
        <svg 
          width={svgSize} 
          height={svgSize}
        >
          <defs>
            <linearGradient id={`gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={fromColor} />
              <stop offset="100%" stopColor={toColor} />
            </linearGradient>
          </defs>
          <path
            d={createHexagonPath(cardSize)}
            fill={`url(#gradient-${index})`}
            stroke="rgba(255, 255, 255, 0.9)"
            strokeWidth={borderWidth}
          />
        </svg>
        
        <div 
          className="absolute inset-0 flex flex-col items-center justify-center text-white text-center"
          style={{ 
            width: svgSize, 
            height: svgSize,
            padding: '12px', // Fixed padding
            // Center the content where the hexagon actually is
            transform: isMobile ? 'none' : `translate(-${(svgSize - cardSize*2) / 2}px, -${(svgSize - cardSize*2) / 2}px)`,
          }}
        >
          <div className="mb-1">
            {React.cloneElement(feature.icon as React.ReactElement, { 
              className: "text-white flex-shrink-0",
              style: { width: `${iconSize}px`, height: `${iconSize}px` }
            })}
          </div>
          <h3 
            className="font-bold leading-tight text-center break-words hyphens-auto"
            style={{ 
              fontSize: `${fontSize}px`,
              maxWidth: isMobile ? '90px' : '120px', // Wider text container for desktop
              lineHeight: '1.1',
              wordBreak: 'break-word',
              overflowWrap: 'break-word'
            }}
          >
            {feature.title}
          </h3>
        </div>
      </div>
    </div>
  );
};