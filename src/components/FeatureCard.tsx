
import React from "react";

export interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  position: string;
  color: string;
  bgColor: string;
}

interface FeatureCardProps {
  feature: Feature;
  className?: string;
  iconSize?: string;
  titleSize?: string;
  descriptionSize?: string;
  padding?: string;
  borderRadius?: string;
  showDescription?: boolean;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  feature,
  className = "",
  iconSize = "w-6 h-6",
  titleSize = "text-sm",
  descriptionSize = "text-xs",
  padding = "p-5",
  borderRadius = "rounded-2xl",
  showDescription = true
}) => {
  return (
    <div className={`${feature.bgColor} backdrop-blur-md ${padding} ${borderRadius} border border-white/30 shadow-xl max-w-80 group hover:scale-105 transition-all duration-300 ${className}`}>
      <div className="flex items-start gap-4">
        <div className={`bg-gradient-to-br ${feature.color} p-3 rounded-xl text-white shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
          {React.cloneElement(feature.icon as React.ReactElement, { className: iconSize })}
        </div>
        <div className="flex-1">
          <h3 className={`font-semibold text-gray-800 mb-2 ${titleSize} leading-tight`}>
            {feature.title}
          </h3>
          {showDescription && (
            <p className={`${descriptionSize} text-gray-600 leading-relaxed`}>
              {feature.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
