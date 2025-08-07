import React from "react";
import { GameState, TargetPosition, ViewportSize } from "../lib/types";
import { getCellDisplay } from "../lib/gameLogic";
import { isSolid } from "../lib/collision";
import { CELL_SIZE, WORLD_WIDTH, WORLD_HEIGHT } from "../lib/constants";

interface GameWorldProps {
  gameState: GameState;
  viewportSize: ViewportSize;
  debugMode: boolean;
  targetPos: TargetPosition;
  isActionable: boolean;
}

export const GameWorld: React.FC<GameWorldProps> = ({
  gameState,
  viewportSize,
  debugMode,
  targetPos,
  isActionable,
}) => {
  // Calculate viewport dimensions
  const viewportWidth = viewportSize.width;
  const viewportHeight = viewportSize.height;
  const tilesWidth = Math.ceil(viewportWidth / CELL_SIZE) + 2;
  const tilesHeight = Math.ceil(viewportHeight / CELL_SIZE) + 2;

  // Calculate camera bounds
  const halfViewportWidth = viewportWidth / 2;
  const halfViewportHeight = viewportHeight / 2;
  const worldPixelWidth = WORLD_WIDTH * CELL_SIZE;
  const worldPixelHeight = WORLD_HEIGHT * CELL_SIZE;

  // Clamp camera to world boundaries
  const cameraX = Math.max(
    halfViewportWidth,
    Math.min(worldPixelWidth - halfViewportWidth, gameState.camera.x)
  );
  const cameraY = Math.max(
    halfViewportHeight,
    Math.min(worldPixelHeight - halfViewportHeight, gameState.camera.y)
  );

  // Calculate which tiles to render
  const startX = Math.floor((cameraX - halfViewportWidth) / CELL_SIZE) - 1;
  const startY = Math.floor((cameraY - halfViewportHeight) / CELL_SIZE) - 1;
  const endX = Math.min(WORLD_WIDTH, startX + tilesWidth);
  const endY = Math.min(WORLD_HEIGHT, startY + tilesHeight);

  return (
    <div
      className="absolute"
      style={{
        width: viewportWidth,
        height: viewportHeight,
        left: 0,
        top: 0,
      }}
    >
      {/* World tiles */}
      {Array.from({ length: Math.max(0, endY - startY) }, (_, y) =>
        Array.from({ length: Math.max(0, endX - startX) }, (_, x) => {
          const worldX = startX + x;
          const worldY = startY + y;

          if (
            worldX < 0 ||
            worldY < 0 ||
            worldX >= WORLD_WIDTH ||
            worldY >= WORLD_HEIGHT
          ) {
            return null;
          }

          const cell = gameState.world[worldY]?.[worldX];
          const screenX = worldX * CELL_SIZE - cameraX + halfViewportWidth;
          const screenY = worldY * CELL_SIZE - cameraY + halfViewportHeight;

          return (
            <div
              key={`${worldX}-${worldY}`}
              className="absolute flex items-center justify-center border border-gray-600/20"
              style={{
                left: screenX,
                top: screenY,
                width: CELL_SIZE,
                height: CELL_SIZE,
                backgroundColor:
                  cell === null
                    ? (worldX + worldY) % 2 === 0
                      ? "#8b4513"
                      : "#654321"
                    : cell === "grass"
                    ? (worldX + worldY) % 2 === 0
                      ? "#22c55e"
                      : "#16a34a"
                    : "#2d5016",
                fontSize: "24px",
              }}
            >
              {getCellDisplay(cell)}
            </div>
          );
        })
      )}

      {/* Debug collision boundaries */}
      {debugMode &&
        Array.from({ length: Math.max(0, endY - startY) }, (_, y) =>
          Array.from({ length: Math.max(0, endX - startX) }, (_, x) => {
            const worldX = startX + x;
            const worldY = startY + y;

            if (
              worldX < 0 ||
              worldY < 0 ||
              worldX >= WORLD_WIDTH ||
              worldY >= WORLD_HEIGHT
            ) {
              return null;
            }

            const cell = gameState.world[worldY]?.[worldX];
            const screenX = worldX * CELL_SIZE - cameraX + halfViewportWidth;
            const screenY = worldY * CELL_SIZE - cameraY + halfViewportHeight;

            if (!isSolid(cell)) return null;

            const debugColor =
              cell === "house_wall"
                ? "rgba(255, 0, 0, 0.5)"
                : cell === "water"
                ? "rgba(0, 0, 255, 0.5)"
                : cell === "tree"
                ? "rgba(139, 69, 19, 0.5)"
                : "rgba(255, 255, 255, 0.5)";

            return (
              <div
                key={`debug-${worldX}-${worldY}`}
                className="absolute border-2 border-red-500 pointer-events-none z-10"
                style={{
                  left: screenX,
                  top: screenY,
                  width: CELL_SIZE,
                  height: CELL_SIZE,
                  backgroundColor: debugColor,
                  borderColor:
                    cell === "house_wall"
                      ? "#ff0000"
                      : cell === "water"
                      ? "#0000ff"
                      : cell === "tree"
                      ? "#8b4513"
                      : "#ffffff",
                }}
                title={`Solid: ${cell}`}
              />
            );
          })
        )}

      {/* Target tile highlight */}
      {isActionable && (
        <div
          className="absolute border-4 border-yellow-400 bg-yellow-400/30 pointer-events-none z-15 animate-pulse"
          style={{
            left: targetPos.x * CELL_SIZE - cameraX + halfViewportWidth,
            top: targetPos.y * CELL_SIZE - cameraY + halfViewportHeight,
            width: CELL_SIZE,
            height: CELL_SIZE,
          }}
        />
      )}

      {/* Player */}
      <div
        className="absolute flex items-center justify-center z-20"
        style={{
          left: gameState.player.pixelX - cameraX + halfViewportWidth,
          top: gameState.player.pixelY - cameraY + halfViewportHeight,
          width: CELL_SIZE,
          height: CELL_SIZE,
          fontSize: "32px",
        }}
      >
        👨‍🌾
      </div>
    </div>
  );
};