import React from "react";
import { GameState, TargetPosition, ToolType } from "../lib/types";
import { TOOLS } from "../lib/constants";
import { formatTerrainForDebug } from "../lib/gameLogic";

interface GameUIProps {
  gameState: GameState;
  debugMode: boolean;
  targetPos: TargetPosition;
  isActionable: boolean;
  onToolSelect: (tool: ToolType) => void;
}

export const GameUI: React.FC<GameUIProps> = ({
  gameState,
  debugMode,
  targetPos,
  isActionable,
  onToolSelect,
}) => {
  return (
    <>
      {/* Main UI Overlay */}
      <div className="absolute top-4 left-4 z-30">
        <h1 className="text-2xl font-bold text-white mb-4">🌙 Night Farming</h1>

        <div className="space-y-3">
          <div className="bg-gray-800/90 p-3 rounded-lg backdrop-blur-sm">
            <h3 className="text-white font-bold mb-2 text-sm">Inventory</h3>
            <div className="text-white text-xs space-y-1">
              <div>🌱 Seeds: {gameState.inventory.seeds}</div>
              <div>🥕 Crops: {gameState.inventory.crops}</div>
              <div>🪙 Coins: {gameState.inventory.coins}</div>
            </div>
          </div>

          <div className="bg-gray-800/90 p-3 rounded-lg backdrop-blur-sm">
            <h3 className="text-white font-bold mb-2 text-sm">Tools</h3>
            <div className="space-y-1">
              {TOOLS.map(tool => (
                <div
                  key={tool.id}
                  className={`flex items-center gap-2 p-2 rounded cursor-pointer text-xs ${
                    gameState.selectedTool === tool.id
                      ? "bg-blue-600 text-white"
                      : "bg-gray-700/80 text-gray-300 hover:bg-gray-600/80"
                  }`}
                  onClick={() => onToolSelect(tool.id as ToolType)}
                >
                  <span>{tool.icon}</span>
                  <span>
                    {tool.name} ({tool.key})
                  </span>
                </div>
              ))}
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

      {/* Controls overlay */}
      <div className="absolute bottom-4 right-4 z-30">
        <div className="bg-gray-800/90 p-3 rounded-lg backdrop-blur-sm">
          <h3 className="text-white font-bold mb-2 text-sm">Controls</h3>
          <div className="text-white text-xs space-y-1">
            <div>🎮 WASD/Arrows: Move</div>
            <div>⌨️ Space: Use Tool</div>
            <div>🔢 1-4: Select Tools</div>
            <div>🔧 F3: Toggle Debug Mode</div>
            <div>🌱 Farm in brown soil area!</div>
          </div>
        </div>
      </div>
    </>
  );
};