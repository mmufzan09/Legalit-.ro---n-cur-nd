import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";

export const GeometricBackground: React.FC = () => {
  const isMobile = useIsMobile();
  
  // Different number of shapes based on screen size
  const shapeCount = isMobile ? 12 : 24;
  
  // Generate random shapes with collision detection
  const shapes = React.useMemo(() => {
    const shapeTypes = ['circle', 'square', 'triangle', 'hexagon'];
    const generatedShapes = [];
    
    // Helper function to check if two shapes overlap (with 10px minimum distance)
    const checkCollision = (newShape: any, existingShapes: any[]) => {
      for (const existingShape of existingShapes) {
        const dx = Math.abs(newShape.x - existingShape.x);
        const dy = Math.abs(newShape.y - existingShape.y);
        
        // Calculate minimum distance needed (shape radii + 10px buffer)
        const minDistance = ((newShape.size + existingShape.size) / 2) + 10;
        
        // Convert percentage positions to pixels for accurate distance calculation
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        const actualDx = (dx / 100) * viewportWidth;
        const actualDy = (dy / 100) * viewportHeight;
        const actualDistance = Math.sqrt(actualDx * actualDx + actualDy * actualDy);
        
        if (actualDistance < minDistance) {
          return true; // Collision detected
        }
      }
      return false; // No collision
    };
    
    for (let i = 0; i < shapeCount; i++) {
      const shapeType = shapeTypes[i % shapeTypes.length];
      const size = Math.random() * 60 + 20; // 20-80px
      
      let x, y;
      let attempts = 0;
      const maxAttempts = 50; // Prevent infinite loops
      
      do {
        // Apply same distribution logic to both mobile and desktop
        if (i < shapeCount / 3) {
          // Top third - fewer shapes
          y = Math.random() * 25; // 0-25%
        } else if (i < (shapeCount * 2) / 3) {
          // Middle third - very few shapes (avoid carousel area)
          y = Math.random() * 20 + 30; // 30-50%
        } else {
          // Bottom third - more shapes
          y = Math.random() * 40 + 60; // 60-100%
        }
        x = Math.random() * 90 + 5; // 5-95%
        
        attempts++;
      } while (
        attempts < maxAttempts && 
        checkCollision({ x, y, size }, generatedShapes)
      );
      
      const rotation = Math.random() * 360;
      const opacity = Math.random() * 0.1 + 0.05; // 0.05-0.15 opacity
      
      generatedShapes.push({
        id: i,
        type: shapeType,
        size,
        x: Math.min(95, Math.max(5, x)), // Keep within bounds
        y: Math.min(95, Math.max(5, y)), // Keep within bounds
        rotation,
        opacity
      });
    }
    
    return generatedShapes;
  }, [shapeCount, isMobile]);
  
  const renderShape = (shape: any) => {
    const baseStyle = {
      position: 'absolute' as const,
      left: `${shape.x}%`,
      top: `${shape.y}%`,
      width: `${shape.size}px`,
      height: `${shape.size}px`,
      transform: `rotate(${shape.rotation}deg)`,
      opacity: shape.opacity,
    };
    
    switch (shape.type) {
      case 'circle':
        return (
          <div
            key={shape.id}
            style={{
              ...baseStyle,
              borderRadius: '50%',
              backgroundColor: '#6B7280', // gray-500
            }}
          />
        );
      case 'square':
        return (
          <div
            key={shape.id}
            style={{
              ...baseStyle,
              backgroundColor: '#9CA3AF', // gray-400
            }}
          />
        );
      case 'triangle':
        return (
          <div
            key={shape.id}
            style={{
              ...baseStyle,
              width: 0,
              height: 0,
              backgroundColor: 'transparent',
              borderLeft: `${shape.size / 2}px solid transparent`,
              borderRight: `${shape.size / 2}px solid transparent`,
              borderBottom: `${shape.size}px solid #6B7280`, // gray-500
            }}
          />
        );
      case 'hexagon':
        return (
          <div
            key={shape.id}
            style={{
              ...baseStyle,
              width: `${shape.size}px`,
              height: `${shape.size * 0.866}px`, // hexagon height ratio
              backgroundColor: '#9CA3AF', // gray-400
              clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
            }}
          />
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 1 }}>
      {shapes.map(renderShape)}
    </div>
  );
};
