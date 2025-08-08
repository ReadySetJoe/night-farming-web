import React from "react";

interface StaminaBarProps {
  stamina: number;
  maxStamina: number;
  isResting: boolean;
}

export const StaminaBar: React.FC<StaminaBarProps> = ({
  stamina,
  maxStamina,
}) => {
  const percentage = (stamina / maxStamina) * 100;
  
  // Color based on stamina level
  const getBarColor = () => {
    if (percentage > 60) return "bg-green-500";
    if (percentage > 30) return "bg-yellow-500";
    return "bg-red-500";
  };
  
  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30">
      <div className="bg-gray-800/90 px-4 py-3 rounded-xl backdrop-blur-sm border border-gray-600">
        <div className="flex items-center gap-3">
          {/* Icon */}
          <div className="text-2xl">⚡</div>
          
          {/* Bar container */}
          <div className="relative w-48 h-6 bg-gray-700 rounded-full overflow-hidden border border-gray-600">
            {/* Stamina fill */}
            <div 
              className={`absolute left-0 top-0 h-full transition-all duration-300 ${getBarColor()}`}
              style={{ width: `${percentage}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20" />
            </div>
            
            {/* Text overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-bold text-white drop-shadow-lg">
                {Math.floor(stamina)} / {maxStamina}
              </span>
            </div>
          </div>
          
          {/* Status text */}
          {stamina <= 20 && (
            <span className="text-xs text-red-400 font-semibold animate-pulse">
              Exhausted!
            </span>
          )}
        </div>
      </div>
    </div>
  );
};