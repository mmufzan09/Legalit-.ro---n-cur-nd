
import React from "react";
import { FeatureCard, Feature } from "./FeatureCard";

interface BackgroundFeaturesProps {
  features: Feature[];
}

export const BackgroundFeatures: React.FC<BackgroundFeaturesProps> = ({ features }) => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Extra large screens - all 8 cards with mobile-style layout */}
      <div className="hidden 2xl:block">
        {features.map((feature, index) => (
          <div
            key={index}
            className={`absolute opacity-60 hover:opacity-80 transition-opacity duration-300 ${
              index === 0 ? 'top-16 left-16' : 
              index === 1 ? 'top-16 right-16' : 
              index === 2 ? 'top-40 left-4' :
              index === 3 ? 'top-40 right-4' :
              index === 4 ? 'bottom-40 left-4' :
              index === 5 ? 'bottom-40 right-4' :
              index === 6 ? 'bottom-16 left-16' :
              'bottom-16 right-16'
            }`}
          >
            <div className={`${feature.bgColor} backdrop-blur-sm p-3 rounded-lg border border-white/20 shadow-sm max-w-32`}>
              <div className="flex flex-col items-center gap-2">
                <div className={`bg-gradient-to-br ${feature.color} p-2 rounded-md text-white shadow-sm`}>
                  {React.cloneElement(feature.icon as React.ReactElement, { className: "w-4 h-4" })}
                </div>
                <h3 className="font-medium text-gray-800 text-xs text-center leading-tight">
                  {feature.title}
                </h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Large screens (xl) - all 8 cards with mobile-style layout */}
      <div className="hidden xl:block 2xl:hidden">
        {features.map((feature, index) => (
          <div
            key={`xl-${index}`}
            className={`absolute opacity-55 ${
              index === 0 ? 'top-12 left-12' : 
              index === 1 ? 'top-12 right-12' : 
              index === 2 ? 'top-36 left-2' :
              index === 3 ? 'top-36 right-2' :
              index === 4 ? 'bottom-36 left-2' :
              index === 5 ? 'bottom-36 right-2' :
              index === 6 ? 'bottom-12 left-12' :
              'bottom-12 right-12'
            }`}
          >
            <div className={`${feature.bgColor} backdrop-blur-sm p-2.5 rounded-md border border-white/20 shadow-sm max-w-28`}>
              <div className="flex flex-col items-center gap-1.5">
                <div className={`bg-gradient-to-br ${feature.color} p-1.5 rounded-sm text-white shadow-sm`}>
                  {React.cloneElement(feature.icon as React.ReactElement, { className: "w-3.5 h-3.5" })}
                </div>
                <h3 className="font-medium text-gray-800 text-xs text-center leading-tight">
                  {feature.title}
                </h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Large screens (lg) - all 8 cards with mobile-style layout */}
      <div className="hidden lg:block xl:hidden">
        {features.map((feature, index) => (
          <div
            key={`lg-${index}`}
            className={`absolute opacity-50 ${
              index === 0 ? 'top-8 left-8' : 
              index === 1 ? 'top-8 right-8' : 
              index === 2 ? 'top-32 left-2' :
              index === 3 ? 'top-32 right-2' :
              index === 4 ? 'bottom-32 left-2' :
              index === 5 ? 'bottom-32 right-2' :
              index === 6 ? 'bottom-8 left-8' :
              'bottom-8 right-8'
            }`}
          >
            <div className={`${feature.bgColor} backdrop-blur-sm p-2 rounded-md border border-white/20 shadow-sm max-w-26`}>
              <div className="flex flex-col items-center gap-1">
                <div className={`bg-gradient-to-br ${feature.color} p-1.5 rounded-sm text-white shadow-sm`}>
                  {React.cloneElement(feature.icon as React.ReactElement, { className: "w-3 h-3" })}
                </div>
                <h3 className="font-medium text-gray-800 text-xs text-center leading-tight">
                  {feature.title}
                </h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Medium screens - 6 cards with mobile-style layout */}
      <div className="hidden md:block lg:hidden">
        {features.slice(0, 6).map((feature, index) => (
          <div
            key={`md-${index}`}
            className={`absolute opacity-45 ${
              index === 0 ? 'top-6 left-6' : 
              index === 1 ? 'top-6 right-6' : 
              index === 2 ? 'top-28 left-1' :
              index === 3 ? 'top-28 right-1' :
              index === 4 ? 'bottom-6 left-6' :
              'bottom-6 right-6'
            }`}
          >
            <div className={`${feature.bgColor} backdrop-blur-sm p-2 rounded-md border border-white/20 shadow-sm max-w-24`}>
              <div className="flex flex-col items-center gap-1">
                <div className={`bg-gradient-to-br ${feature.color} p-1 rounded-sm text-white shadow-sm`}>
                  {React.cloneElement(feature.icon as React.ReactElement, { className: "w-3 h-3" })}
                </div>
                <h3 className="font-medium text-gray-800 text-xs text-center leading-tight">
                  {feature.title}
                </h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Small screens - 4 cards with mobile-style layout */}
      <div className="block md:hidden">
        {features.slice(0, 4).map((feature, index) => (
          <div
            key={`sm-${index}`}
            className={`absolute opacity-40 ${
              index === 0 ? 'top-6 left-3' : 
              index === 1 ? 'top-6 right-3' :
              index === 2 ? 'bottom-20 left-3' :
              'bottom-20 right-3'
            }`}
          >
            <div className={`${feature.bgColor} backdrop-blur-sm p-1.5 rounded-md border border-white/20 shadow-sm max-w-24`}>
              <div className="flex flex-col items-center gap-1">
                <div className={`bg-gradient-to-br ${feature.color} p-1 rounded-sm text-white shadow-sm`}>
                  {React.cloneElement(feature.icon as React.ReactElement, { className: "w-2.5 h-2.5" })}
                </div>
                <h3 className="font-medium text-gray-800 text-xs text-center leading-tight">
                  {feature.title}
                </h3>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
