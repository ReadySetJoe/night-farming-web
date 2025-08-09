import React from "react";
import { GameState } from "../lib/types";

interface NightOverlayProps {
  gameState: GameState;
}

export const NightOverlay: React.FC<NightOverlayProps> = ({ gameState }) => {
  const { nightIntensity, isNight } = gameState.gameTime;
  
  // Don't render overlay during full day
  if (!isNight && nightIntensity <= 0) {
    return null;
  }

  // Calculate overlay opacity and color
  const opacity = nightIntensity;
  const isHorrorTime = gameState.horrorState.currentLevel > 0 && isNight;
  
  const backgroundColor = isHorrorTime 
    ? `rgba(20, 0, 40, ${opacity})` // Dark purple for horror
    : `rgba(0, 0, 20, ${opacity})`; // Dark blue for normal night

  return (
    <div
      className="fixed inset-0 pointer-events-none z-40"
      style={{
        backgroundColor,
        transition: "background-color 2s ease-in-out",
      }}
    >
      {/* Add subtle vignette effect for deeper immersion */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at center, transparent 20%, rgba(0,0,0,${opacity * 0.3}) 100%)`,
        }}
      />
      
      {/* Horror-specific effects */}
      {isHorrorTime && gameState.horrorState.nightmareMode && (
        <div
          className="absolute inset-0 animate-pulse"
          style={{
            background: "rgba(100, 0, 0, 0.1)",
            animationDuration: "3s",
          }}
        />
      )}
      
      {/* Blood moon effect */}
      {gameState.horrorEvent?.type === "blood_moon" && (
        <div
          className="absolute inset-0"
          style={{
            background: "rgba(120, 0, 0, 0.4)",
            animation: "pulse 2s ease-in-out infinite",
          }}
        />
      )}
    </div>
  );
};