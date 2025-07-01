export const getCardPosition = (index: number, rotation: number, isMobile: boolean) => {
  // Fixed 45-degree spacing between cards - this should never change regardless of rotation speed
  const baseAngle = index * 45;
  const angle = (((index * 45 + rotation) % 360 + 360) % 360) * (Math.PI / 180);

  
  // Fixed radius - this ensures cards maintain their distance from center
  const radius = isMobile ? 200 : 360;
  
  // Calculate positions with consistent spacing
  const x = Math.cos(angle) * radius;
  const y = Math.sin(angle) * radius * (isMobile ? 0.3 : 0.36);
  const z = Math.sin(angle) * (isMobile ? 100 : 120);
  
  // Normalize angle to 0-360 degrees for consistent calculations
  const normalizedAngle = ((rotation + baseAngle) % 360 + 360) % 360;
  
  // Calculate cycle position based on normalized angle
  // Front center is at 90 degrees (where x=0 and z is maximum)
  const frontCenterAngle = 90;
  
  // Calculate distance from front center (90 degrees)
  let distanceFromFront = Math.abs(normalizedAngle - frontCenterAngle);
  if (distanceFromFront > 180) {
    distanceFromFront = 360 - distanceFromFront;
  }
  
  // Convert distance to cycle position (1 = front center, 0 = back center)
  const cyclePosition = 1 - (distanceFromFront / 180);
  
  // Consistent scaling and opacity based on position
  const easedPosition = Math.sin(cyclePosition * Math.PI / 2);
  let scale = 0.5 + (easedPosition * 0.7);
  
  // Progressive scaling for tiles within ±10% rotation (±36 degrees) on desktop
  const rotationThreshold = isMobile ? 48 : 54; // 5% for mobile, 10% for desktop
  if (distanceFromFront <= rotationThreshold) {
    // Calculate how close we are to perfect center (0 = at center, 1 = at threshold)
    const proximityToCenter = distanceFromFront / rotationThreshold;
    // Progressive scale bonus: 0% at threshold, +65% at center for desktop (increased from 50%), +20% for mobile
    const maxBonus = isMobile ? 0.5 : 0.65;
    const scaleBonus = (1 - proximityToCenter) * maxBonus;
    scale += scaleBonus;
  }
  
  let opacity;
  if (cyclePosition < 0.05) {
    opacity = 0;
  } else if (cyclePosition < 0.2) {
    const fadeProgress = (cyclePosition - 0.05) / 0.15;
    opacity = Math.pow(fadeProgress, 2) * 0.3;
  } else if (cyclePosition < 0.8) {
    const midProgress = (cyclePosition - 0.2) / 0.6;
    opacity = 0.3 + (Math.sin(midProgress * Math.PI / 2) * 0.5);
  } else {
    const frontProgress = (cyclePosition - 0.8) / 0.2;
    opacity = 0.8 + (Math.sin(frontProgress * Math.PI / 2) * 0.2);
  }

  // Calculate smooth z-index based on precise position
  // Use a high-precision z-index that creates smooth layering
  const preciseZIndex = 1000 + (cyclePosition * 100) + (normalizedAngle * 0.01);
  
  // NEW: Calculate depth-based fade factor for smooth transitions
  // This will be used to create fade effects when tiles overlap
  const depthFactor = cyclePosition; // 0 = back, 1 = front
  
  return { 
    x, 
    y, 
    z, 
    scale: Math.max(0.5, Math.min(isMobile ? 1.85 : 1.85, scale)), // Increased max to 1.85 for desktop to accommodate +65% scaling
    opacity: Math.max(0, Math.min(1, opacity)),
    cyclePosition,
    zIndex: preciseZIndex,
    depthFactor // NEW: For fade transitions
  };
};

export const createHexagonPath = (size: number) => {
  const cornerRadius = size * 0.1; // 10% of size for rounded corners
  const points = [];
  
  // Calculate hexagon vertices
  for (let i = 0; i < 6; i++) {
    const angle = (i * 60) * (Math.PI / 180);
    const x = size + Math.cos(angle) * size;
    const y = size + Math.sin(angle) * size;
    points.push({ x, y });
  }
  
  // Create path with rounded corners
  let path = '';
  
  for (let i = 0; i < 6; i++) {
    const current = points[i];
    const next = points[(i + 1) % 6];
    const prev = points[i === 0 ? 5 : i - 1];
    
    // Calculate direction vectors
    const dx1 = current.x - prev.x;
    const dy1 = current.y - prev.y;
    const len1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);
    
    const dx2 = next.x - current.x;
    const dy2 = next.y - current.y;
    const len2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
    
    // Normalize and scale by corner radius
    const offset1X = (dx1 / len1) * cornerRadius;
    const offset1Y = (dy1 / len1) * cornerRadius;
    
    const offset2X = (dx2 / len2) * cornerRadius;
    const offset2Y = (dy2 / len2) * cornerRadius;
    
    // Calculate rounded corner points
    const cp1X = current.x - offset1X;
    const cp1Y = current.y - offset1Y;
    
    const cp2X = current.x + offset2X;
    const cp2Y = current.y + offset2Y;
    
    // Start path with first point
    if (i === 0) {
      path = `M ${cp2X},${cp2Y}`;
    } else {
      // Add line to start of rounded corner, then quadratic curve
      path += ` L ${cp1X},${cp1Y}`;
      path += ` Q ${current.x},${current.y} ${cp2X},${cp2Y}`;
    }
  }
  
  // Close the path by connecting back to the first corner
  const firstPoint = points[0];
  const lastPoint = points[5];
  const secondPoint = points[1];
  
  // Calculate vectors for the first corner
  const dx1 = firstPoint.x - lastPoint.x;
  const dy1 = firstPoint.y - lastPoint.y;
  const len1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);
  
  const dx2 = secondPoint.x - firstPoint.x;
  const dy2 = secondPoint.y - firstPoint.y;
  const len2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
  
  // Normalize and scale by corner radius for first corner
  const offset1X = (dx1 / len1) * cornerRadius;
  const offset1Y = (dy1 / len1) * cornerRadius;
  
  const cp1X = firstPoint.x - offset1X;
  const cp1Y = firstPoint.y - offset1Y;
  
  // Complete the path with the final corner
  path += ` L ${cp1X},${cp1Y}`;
  path += ` Q ${firstPoint.x},${firstPoint.y} ${firstPoint.x + (dx2 / len2) * cornerRadius},${firstPoint.y + (dy2 / len2) * cornerRadius}`;
  path += ' Z';
  
  return path;
};

export const extractGradientColors = (colorString: string) => {
  // Extract colors from gradient strings like "from-blue-500 to-blue-700"
  const colorMap: { [key: string]: string } = {
    'blue-500': '#3B82F6',
    'blue-700': '#1D4ED8',
    'purple-500': '#8B5CF6',
    'purple-700': '#6D28D9',
    'red-500': '#EF4444',
    'red-700': '#B91C1C',
    'emerald-500': '#10B981',
    'emerald-700': '#047857',
    'slate-600': '#475569',
    'slate-800': '#1E293B',
    'orange-500': '#F97316',
    'orange-700': '#C2410C',
    'pink-500': '#EC4899',
    'pink-700': '#BE185D',
    'teal-600': '#0D9488',
    'teal-800': '#115E59'
  };

  const fromMatch = colorString.match(/from-(\w+-\d+)/);
  const toMatch = colorString.match(/to-(\w+-\d+)/);
  
  const fromColor = fromMatch ? colorMap[fromMatch[1]] || '#3B82F6' : '#3B82F6';
  const toColor = toMatch ? colorMap[toMatch[1]] || '#1D4ED8' : '#1D4ED8';
  
  return { fromColor, toColor };
};