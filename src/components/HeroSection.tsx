import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";

export const HeroSection: React.FC = () => {
  const isMobile = useIsMobile();

  return (
    <div className="text-center max-w-2xl w-full text-5xl pointer-events-none">
      {/* Logo/Brand - moved to top with 10px margin */}
      <div className="mb-6 md:mb-8" style={{ marginTop: '10px' }}>
        <h1 className="text-3xl md:text-4xl font-bold mb-2 tracking-wide">
          <span 
            className="bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-600 bg-clip-text text-transparent" 
            style={{ 
              fontSize: isMobile ? '3rem' : '3.6rem' // text-5xl (3rem) increased by 20% on desktop
            }}
          >Légalité</span>
          <span 
            className="text-black" 
            style={{ 
              fontSize: isMobile ? '3rem' : '3.6rem' // text-5xl (3rem) increased by 20% on desktop
            }}
          >.ro</span>
        </h1>
      </div>

      {/* Description - moved closer to logo */}
      <div className="mb-8 md:mb-12 px-4">
        <p className="text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed max-w-xl mx-auto px-0" style={{ 
          maxWidth: isMobile ? undefined : '650px' // Wider container on desktop to prevent word wrapping
        }}>
          Încarcă orice document legal pentru analiză, cu explicații clare și ușor de înțeles, sau generează contracte și documente juridice personalizate din peste 20 de instrumente specializate disponibile.
        </p>
      </div>

      {/* Main Heading section - removed the "În curând!" text */}
      <div className="mb-8 md:mb-16">
        {/* Text removed - replaced by TapeBanner component */}
      </div>

      {/* Email Signup Form - Removed from here as it's now positioned above footer */}
    </div>
  );
};
