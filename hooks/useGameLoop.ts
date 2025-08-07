import { useEffect } from "react";
import { GameState, KeyState } from "../lib/types";
import { checkCollision, isSolid } from "../lib/collision";
import { createWorld, createTownSquare } from "../lib/world";
import { getNPCFacing } from "../lib/npcs";
import {
  WORLD_WIDTH,
  WORLD_HEIGHT,
  CELL_SIZE,
  MOVE_SPEED,
  CAMERA_MOVE_SPEED,
  FPS,
  CROP_GROWTH_INTERVAL,
} from "../lib/constants";

export const useGameLoop = (
  keys: KeyState,
  setGameState: React.Dispatch<React.SetStateAction<GameState>>
) => {
  // Movement and camera game loop
  useEffect(() => {
    const gameLoop = () => {
      setGameState(prev => {
        const newPlayer = { ...prev.player };
        let moved = false;

        // Get current world dimensions
        const currentWorldHeight = prev.world.length;
        const currentWorldWidth = prev.world[0]?.length || 0;

        // Handle movement based on pressed keys
        if (keys.up && !keys.down) {
          const newPixelY = Math.max(0, newPlayer.pixelY - MOVE_SPEED);
          if (
            newPixelY !== newPlayer.pixelY &&
            !checkCollision(newPlayer.pixelX, newPixelY, prev.world)
          ) {
            newPlayer.pixelY = newPixelY;
            newPlayer.facing = "up";
            newPlayer.isMoving = true;
            moved = true;
          } else if (newPixelY !== newPlayer.pixelY) {
            newPlayer.facing = "up";
          }
        } else if (keys.down && !keys.up) {
          const newPixelY = Math.min(
            (currentWorldHeight - 1) * CELL_SIZE,
            newPlayer.pixelY + MOVE_SPEED
          );
          if (
            newPixelY !== newPlayer.pixelY &&
            !checkCollision(newPlayer.pixelX, newPixelY, prev.world)
          ) {
            newPlayer.pixelY = newPixelY;
            newPlayer.facing = "down";
            newPlayer.isMoving = true;
            moved = true;
          } else if (newPixelY !== newPlayer.pixelY) {
            newPlayer.facing = "down";
          }
        }

        if (keys.left && !keys.right) {
          const newPixelX = Math.max(0, newPlayer.pixelX - MOVE_SPEED);
          if (
            newPixelX !== newPlayer.pixelX &&
            !checkCollision(newPixelX, newPlayer.pixelY, prev.world)
          ) {
            newPlayer.pixelX = newPixelX;
            newPlayer.facing = "left";
            newPlayer.isMoving = true;
            moved = true;
          } else if (newPixelX !== newPlayer.pixelX) {
            newPlayer.facing = "left";
          }
        } else if (keys.right && !keys.left) {
          const newPixelX = Math.min(
            (currentWorldWidth - 1) * CELL_SIZE,
            newPlayer.pixelX + MOVE_SPEED
          );
          if (
            newPixelX !== newPlayer.pixelX &&
            !checkCollision(newPixelX, newPlayer.pixelY, prev.world)
          ) {
            newPlayer.pixelX = newPixelX;
            newPlayer.facing = "right";
            newPlayer.isMoving = true;
            moved = true;
          } else if (newPixelX !== newPlayer.pixelX) {
            newPlayer.facing = "right";
          }
        }

        if (!moved) {
          newPlayer.isMoving = false;
        }

        // Update grid position based on pixel position
        newPlayer.x = Math.round(newPlayer.pixelX / CELL_SIZE);
        newPlayer.y = Math.round(newPlayer.pixelY / CELL_SIZE);

        // Safety check: if player somehow ended up on solid terrain, push them back
        if (isSolid(prev.world[newPlayer.y]?.[newPlayer.x])) {
          // Push player back to their last valid position
          newPlayer.pixelX = prev.player.pixelX;
          newPlayer.pixelY = prev.player.pixelY;
          newPlayer.x = prev.player.x;
          newPlayer.y = prev.player.y;
        }

        // Check for scene transitions after movement
        const currentTile = prev.world[newPlayer.y]?.[newPlayer.x];

        // Handle walkthrough transitions
        if (
          currentTile === "exit_to_town" &&
          prev.currentScene === "exterior"
        ) {
          const townSquareWorld = createTownSquare();
          const townEntranceX = 0; // Same as in world.ts - far left edge
          const townEntranceY = Math.floor(townSquareWorld.length / 2);

          return {
            ...prev,
            currentScene: "town_square",
            world: townSquareWorld,
            player: {
              ...newPlayer,
              x: townEntranceX + 1, // Enter one tile to the right of entrance
              y: townEntranceY, // Same Y as entrance
              pixelX: (townEntranceX + 1) * CELL_SIZE,
              pixelY: townEntranceY * CELL_SIZE,
            },
            camera: {
              x: (townEntranceX + 1) * CELL_SIZE,
              y: townEntranceY * CELL_SIZE,
            },
          };
        }

        if (
          currentTile === "exit_to_farm" &&
          prev.currentScene === "town_square"
        ) {
          const exteriorWorld = createWorld();
          const farmEntranceX = WORLD_WIDTH - 1; // Same as in world.ts - right edge
          const farmEntranceY = Math.floor(WORLD_HEIGHT / 2);

          return {
            ...prev,
            currentScene: "exterior",
            world: exteriorWorld,
            player: {
              ...newPlayer,
              x: farmEntranceX - 1, // Enter one tile to the left of entrance
              y: farmEntranceY, // Same Y as entrance
              pixelX: (farmEntranceX - 1) * CELL_SIZE,
              pixelY: farmEntranceY * CELL_SIZE,
            },
            camera: {
              x: (farmEntranceX - 1) * CELL_SIZE,
              y: farmEntranceY * CELL_SIZE,
            },
          };
        }

        // Update camera to follow player smoothly
        const newCamera = { ...prev.camera };
        const targetCameraX = newPlayer.pixelX;
        const targetCameraY = newPlayer.pixelY;

        // Smooth camera following
        newCamera.x += (targetCameraX - newCamera.x) * CAMERA_MOVE_SPEED;
        newCamera.y += (targetCameraY - newCamera.y) * CAMERA_MOVE_SPEED;

        return { ...prev, player: newPlayer, camera: newCamera };
      });
    };

    const intervalId = setInterval(gameLoop, 1000 / FPS);
    return () => clearInterval(intervalId);
  }, [keys, setGameState]);

  // Crop growth loop
  useEffect(() => {
    const growthInterval = setInterval(() => {
      setGameState(prev => {
        const newWorld = prev.world.map(row =>
          row.map(cell => {
            if (
              cell &&
              typeof cell === "object" &&
              cell.type !== "tilled" &&
              cell.wateringsReceived >= cell.wateringsRequired &&
              cell.stage < cell.maxStage
            ) {
              const timeSincePlanted = Date.now() - cell.plantedAt;
              const shouldGrow =
                timeSincePlanted > (cell.stage + 1) * CROP_GROWTH_INTERVAL;

              if (shouldGrow) {
                return {
                  ...cell,
                  stage: cell.stage + 1,
                  watered: false,
                  wateringsReceived: 0, // Reset waterings for next stage
                };
              }
            }
            return cell;
          })
        );

        return { ...prev, world: newWorld };
      });
    }, 1000);

    return () => clearInterval(growthInterval);
  }, [setGameState]);

  // NPC movement loop
  useEffect(() => {
    const npcMovementInterval = setInterval(() => {
      setGameState(prev => {
        const updatedNPCs = prev.npcs.map(npc => {
          // Only move NPCs in the current scene
          if (npc.scene !== prev.currentScene) {
            return npc;
          }

          // Handle pausing behavior
          if (npc.isPaused) {
            if (npc.pauseTimer > 0) {
              return {
                ...npc,
                pauseTimer: npc.pauseTimer - 1,
                isMoving: false,
              };
            } else {
              // Pause finished, move to next target
              const nextIndex =
                (npc.currentPathIndex + 1) % npc.movementPath.length;
              const nextTarget = npc.movementPath[nextIndex];

              return {
                ...npc,
                currentPathIndex: nextIndex,
                facing: getNPCFacing(npc.x, npc.y, nextTarget.x, nextTarget.y),
                isPaused: false,
                pauseTimer: 0,
                isMoving: true,
              };
            }
          }

          const currentTarget = npc.movementPath[npc.currentPathIndex];
          const targetPixelX = currentTarget.x * CELL_SIZE;
          const targetPixelY = currentTarget.y * CELL_SIZE;

          // Check if NPC has reached current target
          const distanceToTarget = Math.sqrt(
            (npc.pixelX - targetPixelX) ** 2 + (npc.pixelY - targetPixelY) ** 2
          );

          if (distanceToTarget < npc.moveSpeed) {
            // Reached target - check if this target has a pause
            if (currentTarget.pauseTime && currentTarget.pauseTime > 0) {
              return {
                ...npc,
                x: currentTarget.x,
                y: currentTarget.y,
                pixelX: targetPixelX,
                pixelY: targetPixelY,
                isPaused: true,
                pauseTimer: currentTarget.pauseTime,
                isMoving: false,
              };
            } else {
              // No pause, move to next position immediately
              const nextIndex =
                (npc.currentPathIndex + 1) % npc.movementPath.length;
              const nextTarget = npc.movementPath[nextIndex];

              return {
                ...npc,
                x: currentTarget.x,
                y: currentTarget.y,
                pixelX: targetPixelX,
                pixelY: targetPixelY,
                currentPathIndex: nextIndex,
                facing: getNPCFacing(
                  currentTarget.x,
                  currentTarget.y,
                  nextTarget.x,
                  nextTarget.y
                ),
                isMoving: true,
              };
            }
          } else {
            // Move towards current target
            const directionX = targetPixelX - npc.pixelX;
            const directionY = targetPixelY - npc.pixelY;
            const distance = Math.sqrt(directionX ** 2 + directionY ** 2);

            const moveX = (directionX / distance) * npc.moveSpeed;
            const moveY = (directionY / distance) * npc.moveSpeed;

            return {
              ...npc,
              pixelX: npc.pixelX + moveX,
              pixelY: npc.pixelY + moveY,
              x: Math.round((npc.pixelX + moveX) / CELL_SIZE),
              y: Math.round((npc.pixelY + moveY) / CELL_SIZE),
              isMoving: true,
            };
          }
        });

        return { ...prev, npcs: updatedNPCs };
      });
    }, 1000 / FPS);

    return () => clearInterval(npcMovementInterval);
  }, [setGameState]);
};
