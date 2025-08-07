import React from "react";
import { GameState, TargetPosition, ToolType } from "../lib/types";
import { formatTerrainForDebug } from "../lib/gameLogic";
import { generateToolbar } from "../lib/toolbar";

interface GameUIProps {
  gameState: GameState;
  debugMode: boolean;
  targetPos: TargetPosition;
  isActionable: boolean;
  onToolSelect: (tool: ToolType) => void;
}

const formatTime = (hours: number, minutes: number): string => {
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
  const displayMinutes = minutes.toString().padStart(2, '0');
  return `${displayHours}:${displayMinutes} ${period}`;
};

export const GameUI: React.FC<GameUIProps> = ({
  gameState,
  debugMode,
  targetPos,
  isActionable,
  onToolSelect,
}) => {
  const toolbar = generateToolbar(gameState);
  return (
    <>
      {/* Top right - Clock and Coins */}
      <div className="absolute top-4 right-4 z-30">
        <div className="bg-gray-800/90 px-6 py-5 rounded-xl backdrop-blur-sm border border-gray-600">
          <div className="text-white text-center space-y-3">
            <div className="text-3xl font-bold">
              🕐 {formatTime(gameState.gameTime.hours, gameState.gameTime.minutes)}
            </div>
            <div className="text-xl font-semibold">
              🪙 {gameState.inventory.coins}
            </div>
          </div>
        </div>
      </div>

      {/* Game title - top left */}
      <div className="absolute top-4 left-4 z-30">
        <h1 className="text-2xl font-bold text-white">🌙 Night Farming</h1>
      </div>

      {/* Bottom toolbar - Tools and Inventory */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30">
        <div className="bg-gray-800/95 px-8 py-6 rounded-xl backdrop-blur-sm border-2 border-gray-600 shadow-2xl">
          <div className="flex items-center gap-6">
            {/* All Tools (including seeds) */}
            <div className="flex gap-4">
              {toolbar.map((item) => {
                const isSelected = gameState.selectedTool === item.id;
                const isDisabled = item.disabled || false;
                
                return (
                  <div
                    key={item.id}
                    className={`relative w-16 h-16 rounded-xl border-2 cursor-pointer transition-all ${
                      isDisabled
                        ? "bg-gray-800 border-gray-700 opacity-50 cursor-not-allowed"
                        : isSelected
                        ? "bg-blue-600 border-blue-400 shadow-lg shadow-blue-400/40 scale-105"
                        : "bg-gray-700 border-gray-600 hover:bg-gray-600 hover:border-gray-500 hover:scale-102"
                    }`}
                    onClick={() => !isDisabled && onToolSelect(item.id as ToolType)}
                    title={`${item.name}${item.count !== undefined ? ` (${item.count})` : ''} (${item.key})`}
                  >
                    <div className="absolute inset-0 flex items-center justify-center text-3xl">
                      {item.icon}
                    </div>
                    
                    {/* Key number */}
                    <div className="absolute -top-3 -right-3 w-7 h-7 bg-gray-600 text-white text-sm rounded-full flex items-center justify-center font-bold border-2 border-gray-400 shadow-lg">
                      {item.key}
                    </div>
                    
                    {/* Count badge for seeds */}
                    {item.count !== undefined && (
                      <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full font-bold border border-blue-400">
                        {item.count}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Divider */}
            <div className="w-px h-16 bg-gray-500"></div>

            {/* Inventory display only */}
            <div className="flex gap-4">
              {/* Crops */}
              <div className="w-16 h-16 bg-gray-700 border-2 border-gray-600 rounded-xl flex flex-col items-center justify-center">
                <div className="text-2xl">🥕</div>
                <div className="text-sm text-white font-bold bg-gray-800 px-2 py-0.5 rounded-full mt-1">{gameState.inventory.crops}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Debug info overlay */}
      {debugMode && (
        <div className="absolute top-4 right-4 z-30">
          <div className="bg-black/80 p-3 rounded-lg backdrop-blur-sm text-white text-xs font-mono">
            <h3 className="text-yellow-400 font-bold mb-2">DEBUG INFO</h3>
            <div>
              Player Grid: ({gameState.player.x}, {gameState.player.y})
            </div>
            <div>
              Player Pixel: ({Math.round(gameState.player.pixelX)},{" "}
              {Math.round(gameState.player.pixelY)})
            </div>
            <div>Facing: {gameState.player.facing}</div>
            <div>Moving: {gameState.player.isMoving ? "Yes" : "No"}</div>
            <div>
              Current Terrain:{" "}
              {formatTerrainForDebug(
                gameState.world[gameState.player.y]?.[gameState.player.x]
              )}
            </div>
            <div className="mt-1 border-t border-gray-600 pt-1">
              <div>
                Target: ({targetPos.x}, {targetPos.y})
              </div>
              <div>
                Target Terrain:{" "}
                {formatTerrainForDebug(
                  gameState.world[targetPos.y]?.[targetPos.x]
                )}
              </div>
              <div
                className={`${
                  isActionable ? "text-green-400" : "text-red-400"
                }`}
              >
                Actionable: {isActionable ? "Yes" : "No"}
              </div>
            </div>
            <div className="mt-2 border-t border-gray-600 pt-2">
              <div className="text-red-400">🟥 House Walls</div>
              <div className="text-blue-400">🟦 Water</div>
              <div className="text-yellow-600">🟫 Trees</div>
              <div className="text-yellow-400">🟨 Action Target</div>
            </div>
          </div>
        </div>
      )}

      {/* Controls overlay - moved to bottom right */}
      <div className="absolute bottom-4 right-4 z-30">
        <div className="bg-gray-800/90 p-3 rounded-lg backdrop-blur-sm">
          <h3 className="text-white font-bold mb-2 text-sm">Controls</h3>
          <div className="text-white text-xs space-y-1">
            <div>🎮 WASD/Arrows: Move</div>
            <div>⌨️ Space: Use Tool/Talk</div>
            <div>🔢 1-4: Select Tools</div>
            <div>🔧 F3: Toggle Debug Mode</div>
            <div>🌱 Farm in brown soil area!</div>
            <div>💬 Walk near NPCs to talk!</div>
          </div>
        </div>
      </div>

      {/* Dialogue Box */}
      {gameState.activeDialogue && gameState.activeDialogue.isActive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-gray-800/95 border-2 border-gray-600 rounded-xl shadow-2xl backdrop-blur-sm max-w-2xl mx-4">
            <div className="p-8">
              {/* NPC Name */}
              <div className="text-center mb-6">
                <div className="text-4xl mb-2">
                  {gameState.npcs.find(npc => npc.id === gameState.activeDialogue?.npcId)?.emoji}
                </div>
                <h3 className="text-xl font-bold text-white">
                  {gameState.npcs.find(npc => npc.id === gameState.activeDialogue?.npcId)?.name}
                </h3>
              </div>

              {/* Dialogue Text */}
              <div className="bg-gray-700/80 p-6 rounded-lg border border-gray-600 mb-6">
                <p className="text-white text-lg leading-relaxed text-center">
                  {gameState.activeDialogue.text}
                </p>
              </div>

              {/* Continue Prompt */}
              <div className="text-center">
                <div className="text-gray-300 text-sm mb-2">Press SPACE to continue</div>
                <div className="text-yellow-400 text-2xl animate-pulse">⌨️</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};