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
  const halfViewportWidth = viewportWidth / 2;
  const halfViewportHeight = viewportHeight / 2;

  // Handle all interior scene rendering (house, store, blacksmith, cozy house)
  if (gameState.currentScene === "interior" || gameState.currentScene === "general_store" || gameState.currentScene === "blacksmith" || gameState.currentScene === "cozy_house") {
    const worldWidth = gameState.world[0]?.length || 0;
    const worldHeight = gameState.world.length;
    const interiorPixelWidth = worldWidth * CELL_SIZE;
    const interiorPixelHeight = worldHeight * CELL_SIZE;

    // Center the interior on screen
    const offsetX = (viewportWidth - interiorPixelWidth) / 2;
    const offsetY = (viewportHeight - interiorPixelHeight) / 2;

    return (
      <div
        className="absolute"
        style={{
          width: viewportWidth,
          height: viewportHeight,
          left: 0,
          top: 0,
          backgroundColor: "black", // Black void background
        }}
      >
        {/* Interior world tiles */}
        {gameState.world.map((row, y) =>
          row.map((cell, x) => {
            const screenX = offsetX + x * CELL_SIZE;
            const screenY = offsetY + y * CELL_SIZE;

            return (
              <div
                key={`interior-${x}-${y}`}
                className="absolute flex items-center justify-center border border-gray-600/20"
                style={{
                  left: screenX,
                  top: screenY,
                  width: CELL_SIZE,
                  height: CELL_SIZE,
                  backgroundColor:
                    cell === "house_floor" || cell === "building_floor"
                      ? "#8b7355"
                      : cell === "house_wall" || cell === "building_wall"
                      ? "#4a4a4a"
                      : cell === "shop_counter"
                      ? "#d4af37"
                      : cell === "shop_shelf"
                      ? "#8b4513"
                      : cell === "anvil"
                      ? "#708090"
                      : cell === "forge"
                      ? "#b22222"
                      : cell === "kitchen_counter"
                      ? "#deb887"
                      : cell === "bookshelf"
                      ? "#654321"
                      : cell === "display_case"
                      ? "#e6e6fa"
                      : cell === "workbench"
                      ? "#d2691e"
                      : cell === "stove"
                      ? "#2f4f4f"
                      : "#2d5016",
                  fontSize: "24px",
                }}
              >
                {getCellDisplay(cell)}
              </div>
            );
          })
        )}

        {/* Debug collision boundaries for interior */}
        {debugMode &&
          gameState.world.map((row, y) =>
            row.map((cell, x) => {
              const screenX = offsetX + x * CELL_SIZE;
              const screenY = offsetY + y * CELL_SIZE;

              if (!isSolid(cell)) return null;

              const debugColor =
                cell === "house_wall"
                  ? "rgba(255, 0, 0, 0.5)"
                  : "rgba(255, 255, 255, 0.5)";

              return (
                <div
                  key={`interior-debug-${x}-${y}`}
                  className="absolute border-2 border-red-500 pointer-events-none z-10"
                  style={{
                    left: screenX,
                    top: screenY,
                    width: CELL_SIZE,
                    height: CELL_SIZE,
                    backgroundColor: debugColor,
                    borderColor: cell === "house_wall" ? "#ff0000" : "#ffffff",
                  }}
                  title={`Solid: ${cell}`}
                />
              );
            })
          )}

        {/* Target tile highlight for interior */}
        {isActionable && (
          <div
            className="absolute border-4 border-yellow-400 bg-yellow-400/30 pointer-events-none z-15 animate-pulse"
            style={{
              left: offsetX + targetPos.x * CELL_SIZE,
              top: offsetY + targetPos.y * CELL_SIZE,
              width: CELL_SIZE,
              height: CELL_SIZE,
            }}
          />
        )}

        {/* Player in interior */}
        <div
          className="absolute flex items-center justify-center z-20"
          style={{
            left: offsetX + gameState.player.pixelX,
            top: offsetY + gameState.player.pixelY,
            width: CELL_SIZE,
            height: CELL_SIZE,
            fontSize: "32px",
          }}
        >
          👨‍🌾
        </div>
      </div>
    );
  }

  // Handle town square and exterior scenes
  const currentWorldWidth = gameState.world[0]?.length || WORLD_WIDTH;
  const currentWorldHeight = gameState.world.length || WORLD_HEIGHT;

  const tilesWidth = Math.ceil(viewportWidth / CELL_SIZE) + 2;
  const tilesHeight = Math.ceil(viewportHeight / CELL_SIZE) + 2;
  const worldPixelWidth = currentWorldWidth * CELL_SIZE;
  const worldPixelHeight = currentWorldHeight * CELL_SIZE;

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
  const endX = Math.min(currentWorldWidth, startX + tilesWidth);
  const endY = Math.min(currentWorldHeight, startY + tilesHeight);

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
            worldX >= currentWorldWidth ||
            worldY >= currentWorldHeight
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
                    : cell === "stone_path"
                    ? "#9ca3af"
                    : cell === "building_floor"
                    ? "#8b7355"
                    : cell === "building_wall"
                    ? "#4a4a4a"
                    : cell === "fence"
                    ? "#8b4513"
                    : cell === "stone_wall"
                    ? "#6b7280"
                    : cell === "path"
                    ? "#a0845c"
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
              worldX >= currentWorldWidth ||
              worldY >= currentWorldHeight
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

      {/* NPCs */}
      {gameState.npcs
        .filter(npc => npc.scene === gameState.currentScene)
        .map(npc => (
          <div
            key={npc.id}
            className="absolute flex items-center justify-center z-19"
            style={{
              left: npc.pixelX - cameraX + halfViewportWidth,
              top: npc.pixelY - cameraY + halfViewportHeight,
              width: CELL_SIZE,
              height: CELL_SIZE,
              fontSize: "32px",
            }}
          >
            {npc.emoji}
          </div>
        ))}

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