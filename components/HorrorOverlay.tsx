import React from "react";
import { HorrorEvent } from "../lib/types";
import { getHorrorIntensity, getHorrorMessages } from "../lib/horror";

interface HorrorOverlayProps {
  horrorEvent: HorrorEvent | null;
}

export const HorrorOverlay: React.FC<HorrorOverlayProps> = ({
  horrorEvent,
}) => {
  if (!horrorEvent || !horrorEvent.isActive) {
    return null;
  }

  const elapsed = Date.now() - horrorEvent.startTime;
  const progress = elapsed / horrorEvent.duration;
  const intensity = getHorrorIntensity(horrorEvent);
  const messages = getHorrorMessages(progress);
  const currentMessage = messages[Math.floor(elapsed / 1000) % messages.length];

  // Screen effects based on horror intensity
  const redOverlayOpacity = Math.min(intensity * 0.3, 0.3);
  const screenShake = intensity > 0.7 ? intensity * 10 : 0;
  const glitchEffect = intensity > 0.5;

  return (
    <>
      {/* Red horror overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-50 bg-red-900 mix-blend-multiply"
        style={{
          opacity: redOverlayOpacity,
          animation: glitchEffect ? "pulse 0.3s infinite" : undefined,
        }}
      />

      {/* Screen shake container */}
      <div
        className="fixed inset-0 pointer-events-none z-50"
        style={{
          transform: `translate(${
            (Math.random() - 0.5) * screenShake
          }px, ${(Math.random() - 0.5) * screenShake}px)`,
        }}
      >
        {/* Horror message */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="bg-black/80 text-red-500 px-8 py-4 rounded-lg border-2 border-red-700 shadow-2xl"
            style={{
              fontSize: intensity > 0.5 ? "24px" : "18px",
              textShadow: intensity > 0.5 ? "0 0 10px #ff0000" : undefined,
              animation:
                intensity > 0.5
                  ? "pulse 0.5s infinite, bounce 1s infinite"
                  : "fade-in 0.5s",
            }}
          >
            {currentMessage}
          </div>
        </div>

        {/* Flickering darkness at high intensity */}
        {intensity > 0.8 && (
          <div
            className="absolute inset-0 bg-black"
            style={{
              opacity: Math.random() > 0.7 ? 0.9 : 0,
              animation: "flicker 0.1s infinite",
            }}
          />
        )}

        {/* Creepy eyes effect */}
        {intensity > 0.6 && (
          <div className="absolute top-1/4 left-1/4 text-6xl animate-pulse">
            👁️
          </div>
        )}
        {intensity > 0.6 && (
          <div className="absolute bottom-1/3 right-1/4 text-6xl animate-pulse">
            👁️
          </div>
        )}

        {/* Fire particles */}
        {intensity > 0.3 && (
          <>
            <div className="absolute top-10 left-10 text-4xl animate-bounce">
              🔥
            </div>
            <div className="absolute bottom-20 right-20 text-4xl animate-bounce delay-300">
              🔥
            </div>
            <div className="absolute top-1/2 right-10 text-4xl animate-bounce delay-700">
              🔥
            </div>
          </>
        )}
      </div>

      <style jsx>{`
        @keyframes flicker {
          0%, 100% { opacity: 0; }
          50% { opacity: 0.9; }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </>
  );
};