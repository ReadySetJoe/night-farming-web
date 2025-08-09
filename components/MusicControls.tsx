import React from "react";

interface MusicControlsProps {
  isInitialized: boolean;
  isMuted: boolean;
  volume: number;
  onVolumeChange: (volume: number) => void;
  onToggleMute: () => void;
}

export const MusicControls: React.FC<MusicControlsProps> = ({
  isInitialized,
  isMuted,
  volume,
  onVolumeChange,
  onToggleMute,
}) => {
  if (!isInitialized) {
    return (
      <div className="absolute top-4 right-4 z-50">
        <div className="bg-gray-800/90 px-3 py-2 rounded-lg backdrop-blur-sm border border-gray-600">
          <span className="text-xs text-gray-400">Click to enable audio</span>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute top-4 right-4 z-50">
      <div className="bg-gray-800/90 px-4 py-3 rounded-lg backdrop-blur-sm border border-gray-600">
        <div className="flex items-center gap-3">
          {/* Mute button */}
          <button
            onClick={onToggleMute}
            className="text-xl hover:scale-110 transition-transform"
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? "🔇" : "🔊"}
          </button>
          
          {/* Volume slider */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">🎵</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={isMuted ? 0 : volume}
              onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
              className="w-16 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
              disabled={isMuted}
            />
            <span className="text-xs text-gray-400 w-6">
              {Math.round((isMuted ? 0 : volume) * 100)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};