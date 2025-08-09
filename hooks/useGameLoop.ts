import { useEffect } from "react";
import { GameState, KeyState } from "../lib/types";
import { checkCollision, isSolid } from "../lib/collision";
import { createWorld, createTownSquare, createArena, createHouseInterior } from "../lib/world";
import { getNPCFacing } from "../lib/npcs";
import { isHorrorEventActive, updateHorrorState, getRandomHorrorEvent } from "../lib/horror";
import { updateDroppedItems } from "../lib/gameLogic";
import { shouldCorruptCrop, corruptCrop, progressCorruption } from "../lib/seeds";
import { updateEnemyAI, checkEntityCollision, createEnemy, getEligibleEnemyTypes, getRandomEnemyType } from "../lib/enemies";
import {
  WORLD_WIDTH,
  WORLD_HEIGHT,
  CELL_SIZE,
  MOVE_SPEED,
  CAMERA_MOVE_SPEED,
  FPS,
  CROP_GROWTH_INTERVAL,
  STAMINA_DECAY_RATE,
  STAMINA_DECAY_INTERVAL,
  INVULNERABILITY_DURATION,
  ENEMY_DAMAGE,
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

        // Handle arena transitions
        if (
          currentTile === "exit_to_arena" &&
          prev.currentScene === "exterior"
        ) {
          const arenaWorld = createArena();
          const arenaEntranceX = arenaWorld[0].length - 2; // One tile inside from the right edge
          const arenaEntranceY = Math.floor(arenaWorld.length / 2);

          // Spawn an enemy in the arena if none exists (and we're actually entering from exterior)
          const arenaEnemies = prev.enemies.filter(enemy => enemy.scene === "arena");
          let enemies = [...prev.enemies];
          
          // Spawn enemies based on time and horror level
          const maxEnemies = Math.min(1 + Math.floor(prev.horrorState.currentLevel / 3), 4); // 1-4 enemies max
          
          if (arenaEnemies.length < maxEnemies) {
            const eligibleTypes = getEligibleEnemyTypes(prev.gameTime.isNight, prev.horrorState.nightmareMode);
            if (eligibleTypes.length > 0) {
              const enemyType = getRandomEnemyType(eligibleTypes);
              
              // Spawn at random position around the edges
              const margin = 2;
              const isVertical = Math.random() < 0.5;
              let spawnX, spawnY;
              
              if (isVertical) {
                spawnX = Math.random() < 0.5 ? margin : arenaWorld[0].length - margin - 1;
                spawnY = margin + Math.floor(Math.random() * (arenaWorld.length - margin * 2));
              } else {
                spawnX = margin + Math.floor(Math.random() * (arenaWorld[0].length - margin * 2));
                spawnY = Math.random() < 0.5 ? margin : arenaWorld.length - margin - 1;
              }
              
              const enemy = createEnemy(`arena_${enemyType}_${Date.now()}`, enemyType, spawnX, spawnY, "arena");
              enemies.push(enemy);
            }
          }

          return {
            ...prev,
            currentScene: "arena",
            world: arenaWorld,
            enemies,
            player: {
              ...newPlayer,
              x: arenaEntranceX,
              y: arenaEntranceY,
              pixelX: arenaEntranceX * CELL_SIZE,
              pixelY: arenaEntranceY * CELL_SIZE,
            },
            camera: {
              x: arenaEntranceX * CELL_SIZE,
              y: arenaEntranceY * CELL_SIZE,
            },
          };
        }

        if (
          currentTile === "exit_to_farm" &&
          prev.currentScene === "arena"
        ) {
          const exteriorWorld = createWorld();
          const farmEntranceX = 1; // One tile inside from the left edge
          const farmEntranceY = Math.floor(WORLD_HEIGHT / 2);

          return {
            ...prev,
            currentScene: "exterior",
            world: exteriorWorld,
            player: {
              ...newPlayer,
              x: farmEntranceX + 1, // Enter one tile to the right of entrance
              y: farmEntranceY,
              pixelX: (farmEntranceX + 1) * CELL_SIZE,
              pixelY: farmEntranceY * CELL_SIZE,
            },
            camera: {
              x: (farmEntranceX + 1) * CELL_SIZE,
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

        // Update dropped items physics and collection
        let updatedState = updateDroppedItems({ ...prev, player: newPlayer, camera: newCamera });

        // Update player invulnerability timer
        if (updatedState.player.invulnerable && updatedState.player.invulnerabilityTimer > 0) {
          updatedState = {
            ...updatedState,
            player: {
              ...updatedState.player,
              invulnerabilityTimer: Math.max(0, updatedState.player.invulnerabilityTimer - 16), // ~60 FPS
              invulnerable: updatedState.player.invulnerabilityTimer > 16,
            },
          };
        }

        // Update player sword swing timer
        if (updatedState.player.isSwinging && updatedState.player.swingTimer > 0) {
          updatedState = {
            ...updatedState,
            player: {
              ...updatedState.player,
              swingTimer: Math.max(0, updatedState.player.swingTimer - 16), // ~60 FPS
              isSwinging: updatedState.player.swingTimer > 16,
            },
          };
        }

        // Update enemies and check for collisions
        const currentSceneEnemies = updatedState.enemies.filter(enemy => enemy.scene === updatedState.currentScene);
        const otherEnemies = updatedState.enemies.filter(enemy => enemy.scene !== updatedState.currentScene);
        
        const updatedEnemies = currentSceneEnemies.map(enemy => {
          // Update enemy AI
          const worldBounds = {
            width: updatedState.world[0].length * CELL_SIZE,
            height: updatedState.world.length * CELL_SIZE,
          };
          
          const updatedEnemy = updateEnemyAI(
            enemy,
            updatedState.player.pixelX,
            updatedState.player.pixelY,
            worldBounds
          );

          // Check for collision with player
          if (!updatedState.player.invulnerable && checkEntityCollision(updatedState.player, updatedEnemy)) {
            // Deal damage to player and make them invulnerable
            const newHealth = Math.max(0, updatedState.player.health - ENEMY_DAMAGE);
            
            updatedState = {
              ...updatedState,
              player: {
                ...updatedState.player,
                health: newHealth,
                invulnerable: true,
                invulnerabilityTimer: INVULNERABILITY_DURATION,
              },
            };

            // If player died, send them back to bed and advance day
            if (newHealth <= 0) {
              const newDay = updatedState.gameTime.day + 1;
              
              updatedState = {
                ...updatedState,
                currentScene: "interior",
                world: createHouseInterior(),
                gameTime: {
                  hours: 6, // 6:00 AM
                  minutes: 0,
                  totalMinutes: 6 * 60,
                  day: newDay,
                  isNight: false, // 6 AM is day time
                  nightIntensity: 0, // No darkness at 6 AM
                },
                player: {
                  ...updatedState.player,
                  x: 4, // Bed position in interior
                  y: 3,
                  pixelX: 4 * CELL_SIZE,
                  pixelY: 3 * CELL_SIZE,
                  health: updatedState.player.maxHealth, // Restore full health
                  invulnerable: false,
                  invulnerabilityTimer: 0,
                  stamina: updatedState.player.maxStamina, // Restore stamina
                  isSwinging: false,
                  swingTimer: 0,
                },
                camera: {
                  x: 4 * CELL_SIZE,
                  y: 3 * CELL_SIZE,
                },
              };
            }
          }

          return updatedEnemy;
        });

        // Combine updated enemies with enemies from other scenes
        updatedState = {
          ...updatedState,
          enemies: [...otherEnemies, ...updatedEnemies],
        };

        // Check for bed interaction in house interior
        if (updatedState.currentScene === "interior") {
          const bedCell = updatedState.world[newPlayer.y]?.[newPlayer.x];
          if (bedCell === "furniture_bed" && !updatedState.savePrompt) {
            updatedState = {
              ...updatedState,
              savePrompt: { isActive: true },
            };
          }
        }

        return updatedState;
      });
    };

    const intervalId = setInterval(gameLoop, 1000 / FPS);
    return () => clearInterval(intervalId);
  }, [keys, setGameState]);

  // Crop growth and corruption loop
  useEffect(() => {
    const growthInterval = setInterval(() => {
      setGameState(prev => {
        const newWorld = prev.world.map(row =>
          row.map(cell => {
            if (cell && typeof cell === "object" && cell.type !== "tilled") {
              let updatedCell = { ...cell };
              
              // Handle normal crop growth
              if (
                !cell.isCorrupted &&
                cell.wateringsReceived >= cell.wateringsRequired &&
                cell.stage < cell.maxStage
              ) {
                const timeSincePlanted = Date.now() - cell.plantedAt;
                const shouldGrow =
                  timeSincePlanted > (cell.stage + 1) * CROP_GROWTH_INTERVAL;

                if (shouldGrow) {
                  updatedCell = {
                    ...updatedCell,
                    stage: updatedCell.stage + 1,
                    watered: false,
                    wateringsReceived: 0, // Reset waterings for next stage
                  };
                }
              }
              
              // Handle corruption spread
              if (shouldCorruptCrop(updatedCell, prev.horrorState.currentLevel, prev.horrorState.corruptionSpread)) {
                updatedCell = corruptCrop(updatedCell);
              } else if (updatedCell.isCorrupted && Math.random() < 0.1) {
                // Progress existing corruption slowly (10% chance per tick)
                updatedCell = progressCorruption(updatedCell);
              }
              
              return updatedCell;
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

  // Horror event management and progression
  useEffect(() => {
    const horrorInterval = setInterval(() => {
      setGameState(prev => {
        let updatedState = { ...prev };

        // Update horror progression based on current day
        updatedState.horrorState = updateHorrorState(updatedState);

        // Check if current horror event should end
        if (updatedState.horrorEvent && !isHorrorEventActive(updatedState.horrorEvent)) {
          // Add to recent events to prevent immediate re-trigger
          const eventType = updatedState.horrorEvent.type;
          updatedState.horrorState = {
            ...updatedState.horrorState,
            recentEvents: [...updatedState.horrorState.recentEvents.slice(-4), eventType], // Keep last 5 events
          };
          updatedState.horrorEvent = null;
        }

        // Try to trigger new horror event (every 10 seconds, with random chance)
        if (!updatedState.horrorEvent && Math.random() < 0.1) {
          const newEvent = getRandomHorrorEvent(updatedState);
          if (newEvent) {
            updatedState.horrorEvent = newEvent;
          }
        }

        return updatedState;
      });
    }, 1000); // Check every second for horror events

    return () => clearInterval(horrorInterval);
  }, [setGameState]);

  // Gradual stamina depletion over time
  useEffect(() => {
    const staminaInterval = setInterval(() => {
      setGameState(prev => {
        // Gradually reduce stamina over time
        if (prev.player.stamina > 0) {
          const newStamina = Math.max(0, prev.player.stamina - STAMINA_DECAY_RATE);
          
          return {
            ...prev,
            player: {
              ...prev.player,
              stamina: newStamina,
            },
          };
        }
        
        return prev;
      });
    }, STAMINA_DECAY_INTERVAL);

    return () => clearInterval(staminaInterval);
  }, [setGameState]);
};
