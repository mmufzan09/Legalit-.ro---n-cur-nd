import React from "react";
import { HeroSection } from "@/components/HeroSection";
import { HexagonalCarousel } from "@/components/HexagonalCarousel";
import { EmailSignup } from "@/components/EmailSignup";
import { TapeBanner } from "@/components/TapeBanner";
import { GeometricBackground } from "@/components/GeometricBackground";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@radix-ui/react-slider"; // Ensure this is installed
import { useState, useCallback } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const isMobile = useIsMobile();
  
  // Move email signup up by 75px on mobile
  const emailSignupTransform = isMobile ? 'translateY(-75px)' : 'translateY(2px)';
  
  // Slider state and handler
  const [value, setValue] = useState([50]); // Initial slider value
  const handleValueChange = useCallback(
    (newValue: number[]) => {
      setValue(newValue); // Efficient state update
    },
    []
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col relative overflow-hidden">
      {/* Geometric Background - Very background layer */}
      <GeometricBackground />
      
      {/* Hexagonal Carousel - Restricted drag area */}
      <HexagonalCarousel />
      
      {/* Diagonal Tape Banner - Full viewport overlay */}
      <TapeBanner />
      
      {/* Main content area - positioned at top with slider */}
      <div className="flex-1 flex justify-center relative pt-0 pointer-events-none" style={{ zIndex: 6 }}>
        <HeroSection />
        <ScrollArea className="w-1/3 max-w-xs mt-4 touch-action-auto">
          <div className="p-2">
            <Slider
              value={value}
              onValueChange={handleValueChange}
              className="touch-action-manipulation"
              aria-label="Progress slider"
              max={100}
              step={1}
            />
            <p className="text-center mt-2 text-sm text-gray-600">Value: {value[0]}</p>
          </div>
        </ScrollArea>
      </div>
      
      {/* Email Signup - Ensured clickability with higher z-index */}
      <div className="relative px-4 pb-1 pointer-events-auto" style={{ marginBottom: '5px', zIndex: 10, transform: emailSignupTransform }}>
        <EmailSignup />
        {/* Copyright just below EmailSignup on mobile */}
        {isMobile && (
          <div className="block md:hidden w-full text-center" style={{ marginTop: 20 }}>
            <p className="text-gray-500 text-sm">© 2025 Légalité.ro</p>
          </div>
        )}
      </div>
      
      {/* Footer - Render only on desktop */}
      {!isMobile && (
        <footer 
          className="relative py-4 pointer-events-auto"
          style={{ zIndex: 2 }}
        >
          <div className="text-center">
            <p className="text-gray-500 text-sm">© 2025 Légalité.ro</p>
          </div>
        </footer>
      )}
    </div>
  );
};

export default Index;




















// import React from "react";
// import { HeroSection } from "@/components/HeroSection";
// import { HexagonalCarousel } from "@/components/HexagonalCarousel";
// import { EmailSignup } from "@/components/EmailSignup";
// import { TapeBanner } from "@/components/TapeBanner";
// import { GeometricBackground } from "@/components/GeometricBackground";
// import { useIsMobile } from "@/hooks/use-mobile";

// const Index = () => {
//   const isMobile = useIsMobile();
  
//   // Move email signup up by 75px on mobile (increased from 50px)
//   const emailSignupTransform = isMobile ? 'translateY(-75px)' : 'translateY(2px)';
  
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col relative overflow-hidden">
//       {/* Geometric Background - Very background layer */}
//       <GeometricBackground />
      
//       {/* Hexagonal Carousel - Restricted drag area */}
//       <HexagonalCarousel />
      
//       {/* Diagonal Tape Banner - Full viewport overlay */}
//       <TapeBanner />
      
//       {/* Main content area - positioned at top */}
//       <div className="flex-1 flex justify-center relative pt-0 pointer-events-none" style={{ zIndex: 6 }}>
//         <HeroSection />
//       </div>
      
//       {/* Email Signup - Ensured clickability with higher z-index */}
//       <div className="relative px-4 pb-1 pointer-events-auto" style={{ marginBottom: '5px', zIndex: 10, transform: emailSignupTransform }}>
//         <EmailSignup />
//         {/* Copyright just below EmailSignup on mobile */}
//         {isMobile && (
//           <div className="block md:hidden w-full text-center" style={{ marginTop: 20 }}>
//             <p className="text-gray-500 text-sm">© 2025 Légalité.ro</p>
//           </div>
//         )}
//       </div>
      
//       {/* Footer - Render only on desktop */}
//       {!isMobile && (
//         <footer 
//           className="relative py-4 pointer-events-auto"
//           style={{
//             zIndex: 2,
//           }}
//         >
//           <div className="text-center">
//             <p className="text-gray-500 text-sm">© 2025 Légalité.ro</p>
//           </div>
//         </footer>
//       )}
//     </div>
//   );
// };

// export default Index;

