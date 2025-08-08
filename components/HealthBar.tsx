import React from "react";

interface HealthBarProps {
  health: number;
  maxHealth: number;
  invulnerable: boolean;
}

export const HealthBar: React.FC<HealthBarProps> = ({
  health,
  maxHealth,
  invulnerable,
}) => {
  const percentage = (health / maxHealth) * 100;
  
  // Color based on health level
  const getBarColor = () => {
    if (percentage > 60) return "bg-red-500";
    if (percentage > 30) return "bg-orange-500";
    return "bg-red-700";
  };
  
  return (
    <div className="absolute top-20 left-1/2 -translate-x-1/2 z-30">
      <div className={`bg-gray-800/90 px-4 py-3 rounded-xl backdrop-blur-sm border border-gray-600 ${invulnerable ? 'animate-pulse' : ''}`}>
        <div className="flex items-center gap-3">
          {/* Icon */}
          <div className="text-2xl">
            {invulnerable ? "🛡️" : "❤️"}
          </div>
          
          {/* Bar container */}
          <div className="relative w-48 h-6 bg-gray-700 rounded-full overflow-hidden border border-gray-600">
            {/* Health fill */}
            <div 
              className={`absolute left-0 top-0 h-full transition-all duration-300 ${getBarColor()}`}
              style={{ width: `${percentage}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20" />
            </div>
            
            {/* Text overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-bold text-white drop-shadow-lg">
                {Math.floor(health)} / {maxHealth}
              </span>
            </div>
          </div>
          
          {/* Status text */}
          {health <= 20 && !invulnerable && (
            <span className="text-xs text-red-400 font-semibold animate-pulse">
              Critical!
            </span>
          )}
        </div>
      </div>
    </div>
  );
};