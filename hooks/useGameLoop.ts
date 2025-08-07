import { useEffect } from "react";
import { GameState, KeyState } from "../lib/types";
import { checkCollision, isSolid } from "../lib/collision";
import { 
  WORLD_WIDTH, 
  WORLD_HEIGHT, 
  CELL_SIZE, 
  MOVE_SPEED, 
  CAMERA_MOVE_SPEED,
  FPS,
  CROP_GROWTH_INTERVAL
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
            (WORLD_HEIGHT - 1) * CELL_SIZE,
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
            (WORLD_WIDTH - 1) * CELL_SIZE,
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
        const newWorld = prev.world.map((row, y) =>
          row.map((cell, x) => {
            if (
              cell &&
              typeof cell === "object" &&
              cell.type !== "tilled" &&
              cell.watered &&
              cell.stage < cell.maxStage
            ) {
              const timeSincePlanted = Date.now() - cell.plantedAt;
              const shouldGrow = timeSincePlanted > (cell.stage + 1) * CROP_GROWTH_INTERVAL;

              if (shouldGrow) {
                return { ...cell, stage: cell.stage + 1, watered: false };
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
};