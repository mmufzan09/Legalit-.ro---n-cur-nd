import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";

export const TapeBanner: React.FC = () => {
  const isMobile = useIsMobile();
  
  // Move banner up by 50px on mobile, 20px on desktop
  const verticalOffset = isMobile ? '-70px' : '-20px';
  
  // Banner height - 50% thicker on desktop
  const bannerHeight = isMobile ? '24px' : '36px'; // 24px * 1.5 = 36px
  const translateY = isMobile ? '-12px' : '-18px'; // Half of height for centering
  
  return (
    <div 
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{ 
        zIndex: 20,
        transform: `translateY(${verticalOffset})`
      }}
    >
      {/* First tape: top-left to bottom-right (-15 degrees) */}
      <div
        className="absolute bg-gradient-to-r from-black via-gray-800 to-black border-t-2 border-b-2 border-gray-900 shadow-lg flex items-center"
        style={{
          width: '140%',
          height: bannerHeight,
          top: '50%',
          left: '-20%',
          transform: `translateY(${translateY}) rotate(-15deg)`,
          transformOrigin: 'center'
        }}
      >
        <div className="flex items-center space-x-2 whitespace-nowrap">
          {Array.from({ length: 20 }, (_, i) => (
            <React.Fragment key={i}>
              <span className="text-white font-bold uppercase tracking-wide text-xs md:text-sm">
                În curând!
              </span>
              {i < 19 && <span className="text-white font-bold">-</span>}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Second tape: bottom-left to top-right (+15 degrees) */}
      <div
        className="absolute bg-gradient-to-r from-black via-gray-800 to-black border-t-2 border-b-2 border-gray-900 shadow-lg flex items-center"
        style={{
          width: '140%',
          height: bannerHeight,
          top: '50%',
          left: '-20%',
          transform: `translateY(${translateY}) rotate(15deg)`,
          transformOrigin: 'center'
        }}
      >
        <div className="flex items-center space-x-2 whitespace-nowrap">
          {Array.from({ length: 20 }, (_, i) => (
            <React.Fragment key={i}>
              <span className="text-white font-bold uppercase tracking-wide text-xs md:text-sm">
                În curând!
              </span>
              {i < 19 && <span className="text-white font-bold">-</span>}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};
