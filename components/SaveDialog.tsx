import React from "react";
import { GameState } from "../lib/types";

interface SaveDialogProps {
  gameState: GameState;
  onSave: () => void;
  onCancel: () => void;
}

export const SaveDialog: React.FC<SaveDialogProps> = ({
  gameState,
  onSave,
  onCancel,
}) => {
  if (!gameState.savePrompt || !gameState.savePrompt.isActive) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80" onClick={onCancel} />
      
      {/* Dialog */}
      <div className="relative bg-gray-800 border-4 border-gray-600 rounded-xl p-8 max-w-md">
        <div className="text-center space-y-6">
          {/* Bed icon */}
          <div className="text-6xl">🛏️</div>
          
          {/* Title */}
          <h2 className="text-3xl font-bold text-white">Rest for the Night?</h2>
          
          {/* Description */}
          <div className="text-white space-y-2">
            <p className="text-lg">
              Save your progress and advance to Day {(gameState.gameTime?.day || 1) + 1}?
            </p>
            <p className="text-sm text-gray-400">
              You'll wake up at 6:00 AM tomorrow.
            </p>
          </div>
          
          {/* Current stats */}
          <div className="bg-gray-900 rounded-lg p-4 text-sm text-gray-300">
            <div className="flex justify-between">
              <span>Current Day:</span>
              <span className="font-bold">Day {gameState.gameTime?.day || 1}</span>
            </div>
            <div className="flex justify-between mt-2">
              <span>Current Time:</span>
              <span className="font-bold">
                {gameState.gameTime.hours === 0 ? 12 : gameState.gameTime.hours > 12 ? gameState.gameTime.hours - 12 : gameState.gameTime.hours}
                :{gameState.gameTime.minutes.toString().padStart(2, "0")} 
                {gameState.gameTime.hours >= 12 ? " PM" : " AM"}
              </span>
            </div>
          </div>
          
          {/* Buttons */}
          <div className="flex gap-4 justify-center">
            <button
              onClick={onSave}
              className="px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-lg transition-colors"
            >
              💤 Sleep & Save
            </button>
            <button
              onClick={onCancel}
              className="px-6 py-3 bg-gray-600 hover:bg-gray-500 text-white font-bold rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};