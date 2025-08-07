import { GameState } from "./types";
import { STARTING_HOUR, STARTING_MINUTE, CELL_SIZE } from "./constants";
import { createHouseInterior } from "./world";

const SAVE_KEY = "night_farming_save";

export interface SaveData {
  inventory: GameState["inventory"];
  exteriorWorld: GameState["world"]; // Save the exterior world state (crops, etc.)
  gameTime: {
    day: number;
  };
  treeHealth: Array<[string, { health: number; maxHealth: number }]>;
  droppedItems: GameState["droppedItems"];
  npcs: Array<{
    id: string;
    x: number;
    y: number;
    currentDialogueIndex: number;
    currentPathIndex: number;
  }>;
}

export const saveGame = (gameState: GameState): void => {
  try {
    // Get the saved exterior world from localStorage
    const savedExterior = localStorage.getItem("night_farming_exterior_backup");
    let exteriorWorld = gameState.world;
    
    if (savedExterior && savedExterior !== "undefined" && savedExterior !== "null") {
      try {
        exteriorWorld = JSON.parse(savedExterior);
      } catch (error) {
        console.warn("Failed to parse saved exterior world, using current world");
        exteriorWorld = gameState.world;
      }
    }
    
    const saveData: SaveData = {
      inventory: gameState.inventory,
      exteriorWorld: exteriorWorld, // Use backed up exterior world
      gameTime: {
        day: (gameState.gameTime?.day || 1) + 1, // Increment day on save (default to 1 if undefined)
      },
      // Convert Map to array for serialization
      treeHealth: Array.from(gameState.treeHealth.entries()),
      droppedItems: gameState.droppedItems,
      npcs: gameState.npcs.map(npc => ({
        id: npc.id,
        x: npc.x,
        y: npc.y,
        currentDialogueIndex: npc.currentDialogueIndex,
        currentPathIndex: npc.currentPathIndex,
      })),
    };

    localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
    console.log("Game saved successfully!");
  } catch (error) {
    console.error("Failed to save game:", error);
  }
};

export const loadGame = (): SaveData | null => {
  try {
    const savedData = localStorage.getItem(SAVE_KEY);
    if (!savedData) return null;

    const saveData = JSON.parse(savedData) as SaveData;
    console.log("Game loaded successfully!");
    return saveData;
  } catch (error) {
    console.error("Failed to load game:", error);
    return null;
  }
};

export const hasSaveGame = (): boolean => {
  return localStorage.getItem(SAVE_KEY) !== null;
};

export const deleteSave = (): void => {
  localStorage.removeItem(SAVE_KEY);
  console.log("Save deleted");
};

export const applySaveData = (
  currentState: GameState,
  saveData: SaveData
): GameState => {
  // Store the exterior world in localStorage for later retrieval
  if (saveData.exteriorWorld) {
    localStorage.setItem("night_farming_exterior_backup", JSON.stringify(saveData.exteriorWorld));
  }
  
  // Load the house interior world
  const interiorWorld = createHouseInterior();
  
  // Position player near bed but not on it (to avoid retriggering save)
  const playerX = Math.floor(interiorWorld[0].length / 2);
  const playerY = 3; // Near the bed but not on it
  
  return {
    ...currentState,
    inventory: saveData.inventory,
    world: interiorWorld,
    currentScene: "interior", // Always load in house
    gameTime: {
      hours: STARTING_HOUR,
      minutes: STARTING_MINUTE,
      totalMinutes: STARTING_HOUR * 60 + STARTING_MINUTE,
      day: saveData.gameTime?.day || 1, // Default to 1 if day is missing
    },
    player: {
      ...currentState.player,
      x: playerX,
      y: playerY,
      pixelX: playerX * CELL_SIZE,
      pixelY: playerY * CELL_SIZE,
    },
    camera: {
      x: playerX * CELL_SIZE,
      y: playerY * CELL_SIZE,
    },
    treeHealth: new Map(saveData.treeHealth),
    droppedItems: saveData.droppedItems,
    npcs: currentState.npcs.map(npc => {
      const savedNpc = saveData.npcs.find(n => n.id === npc.id);
      if (savedNpc) {
        return {
          ...npc,
          x: savedNpc.x,
          y: savedNpc.y,
          pixelX: savedNpc.x * 48,
          pixelY: savedNpc.y * 48,
          currentDialogueIndex: savedNpc.currentDialogueIndex,
          currentPathIndex: savedNpc.currentPathIndex,
        };
      }
      return npc;
    }),
  };
};