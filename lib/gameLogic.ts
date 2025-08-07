import {
  GameState,
  Player,
  TargetPosition,
  Inventory,
  TerrainType,
  ToolType,
  SeedType,
} from "./types";
import {
  WORLD_WIDTH,
  WORLD_HEIGHT,
  FARM_START_X,
  FARM_START_Y,
  FARM_SIZE,
  CELL_SIZE,
} from "./constants";
import {
  createHouseInterior,
  createTownSquare,
  createWorld,
  createGeneralStoreInterior,
  createBlacksmithInterior,
  createCozyHouseInterior,
} from "./world";
import { getSeedConfig } from "./seeds";
import { canInteractWithNPC, getNextDialogue, advanceDialogue } from "./npcs";
import { getCropDisplay } from "./seeds";

export const getTargetPosition = (player: Player): TargetPosition => {
  let targetX = player.x;
  let targetY = player.y;

  switch (player.facing) {
    case "up":
      targetY = Math.max(0, targetY - 1);
      break;
    case "down":
      targetY = Math.min(WORLD_HEIGHT - 1, targetY + 1);
      break;
    case "left":
      targetX = Math.max(0, targetX - 1);
      break;
    case "right":
      targetX = Math.min(WORLD_WIDTH - 1, targetX + 1);
      break;
  }

  return { x: targetX, y: targetY };
};

export const isTargetActionable = (
  targetX: number,
  targetY: number,
  selectedTool: ToolType,
  world: TerrainType[][],
  inventory: Inventory
): boolean => {
  const currentCell = world[targetY]?.[targetX];

  // Special case: forge is always interactable regardless of tool
  if (currentCell === "forge") {
    return true;
  }

  // Check if target is on farmable land
  const farmX = targetX - FARM_START_X;
  const farmY = targetY - FARM_START_Y;
  const isOnFarm =
    farmX >= 0 && farmX < FARM_SIZE && farmY >= 0 && farmY < FARM_SIZE;

  if (!isOnFarm) return false; // Can't farm outside the farm area

  switch (selectedTool) {
    case "hoe":
      return !currentCell; // Can till empty soil

    case "parsnip":
    case "potato":
      return !!(
        currentCell &&
        typeof currentCell === "object" &&
        currentCell.type === "tilled" &&
        inventory.seeds[selectedTool as SeedType] > 0
      ); // Can plant on tilled soil if we have seeds

    case "watering_can":
      return !!(
        currentCell &&
        typeof currentCell === "object" &&
        currentCell.type !== "tilled" &&
        currentCell.wateringsReceived < currentCell.wateringsRequired
      ); // Can water unwatered crops

    case "hand":
      return !!(
        currentCell &&
        typeof currentCell === "object" &&
        currentCell.type !== "tilled" &&
        currentCell.stage === currentCell.maxStage
      ); // Can harvest mature crops only

    default:
      return false;
  }
};

export const handleAction = (prevState: GameState): GameState => {
  const {
    player,
    world,
    selectedTool,
    inventory,
    currentScene,
    npcs,
    activeDialogue,
  } = prevState;
  const targetPos = getTargetPosition(player);
  const { x: targetX, y: targetY } = targetPos;
  const targetCell = world[targetY]?.[targetX];

  // Handle dialogue dismissal
  if (activeDialogue && activeDialogue.isActive) {
    return {
      ...prevState,
      activeDialogue: null,
    };
  }

  // Check for NPC interactions
  const interactableNPC = npcs.find(
    npc =>
      npc.scene === currentScene && canInteractWithNPC(player.x, player.y, npc)
  );

  if (interactableNPC) {
    const dialogue = getNextDialogue(interactableNPC);
    const updatedNPC = advanceDialogue(interactableNPC);
    const updatedNPCs = npcs.map(npc =>
      npc.id === interactableNPC.id ? updatedNPC : npc
    );

    return {
      ...prevState,
      npcs: updatedNPCs,
      activeDialogue: {
        npcId: interactableNPC.id,
        text: dialogue,
        isActive: true,
      },
    };
  }

  // Handle forge interaction for horror event
  if (targetCell === "forge" && currentScene === "blacksmith") {
    return {
      ...prevState,
      horrorEvent: {
        id: "forge_nightmare_001",
        type: "forge_nightmare",
        isActive: true,
        startTime: Date.now(),
        duration: 8000, // 8 seconds of horror
        intensity: 1,
      },
    };
  }

  // Handle scene transitions
  if (targetCell === "house_door") {
    if (currentScene === "exterior") {
      // Enter house
      const interiorWorld = createHouseInterior();
      return {
        ...prevState,
        currentScene: "interior",
        world: interiorWorld,
        player: {
          ...player,
          x: Math.floor(interiorWorld[0].length / 2),
          y: interiorWorld.length - 2, // Just inside the door
          pixelX: Math.floor(interiorWorld[0].length / 2) * CELL_SIZE,
          pixelY: (interiorWorld.length - 2) * CELL_SIZE,
        },
        camera: {
          x: Math.floor(interiorWorld[0].length / 2) * CELL_SIZE,
          y: (interiorWorld.length - 2) * CELL_SIZE,
        },
      };
    } else {
      // Exit house
      const exteriorWorld = createWorld();
      return {
        ...prevState,
        currentScene: "exterior",
        world: exteriorWorld,
        player: {
          ...player,
          x: 4,
          y: 4, // Just outside the house door
          pixelX: 4 * CELL_SIZE,
          pixelY: 4 * CELL_SIZE,
        },
        camera: {
          x: 4 * CELL_SIZE,
          y: 4 * CELL_SIZE,
        },
      };
    }
  }

  // Handle building door interactions in town
  if (targetCell === "building_door" && currentScene === "town_square") {
    // Determine which building based on player position
    const playerX = player.x;
    const playerY = player.y;

    // General store entrance (around x: 5, y: 9)
    if (playerX >= 2 && playerX <= 8 && playerY >= 5 && playerY <= 10) {
      const storeInterior = createGeneralStoreInterior();
      return {
        ...prevState,
        currentScene: "general_store",
        world: storeInterior,
        player: {
          ...player,
          x: Math.floor(storeInterior[0].length / 2),
          y: storeInterior.length - 2,
          pixelX: Math.floor(storeInterior[0].length / 2) * CELL_SIZE,
          pixelY: (storeInterior.length - 2) * CELL_SIZE,
        },
        camera: {
          x: Math.floor(storeInterior[0].length / 2) * CELL_SIZE,
          y: (storeInterior.length - 2) * CELL_SIZE,
        },
      };
    }

    // Blacksmith entrance (around x: 15, y: 4)
    if (playerX >= 12 && playerX <= 18 && playerY >= 1 && playerY <= 5) {
      const blacksmithInterior = createBlacksmithInterior();
      return {
        ...prevState,
        currentScene: "blacksmith",
        world: blacksmithInterior,
        player: {
          ...player,
          x: Math.floor(blacksmithInterior[0].length / 2),
          y: blacksmithInterior.length - 2,
          pixelX: Math.floor(blacksmithInterior[0].length / 2) * CELL_SIZE,
          pixelY: (blacksmithInterior.length - 2) * CELL_SIZE,
        },
        camera: {
          x: Math.floor(blacksmithInterior[0].length / 2) * CELL_SIZE,
          y: (blacksmithInterior.length - 2) * CELL_SIZE,
        },
      };
    }

    // Cozy house entrance (around x: 24, y: 10)
    if (playerX >= 22 && playerX <= 27 && playerY >= 6 && playerY <= 11) {
      const cozyInterior = createCozyHouseInterior();
      return {
        ...prevState,
        currentScene: "cozy_house",
        world: cozyInterior,
        player: {
          ...player,
          x: Math.floor(cozyInterior[0].length / 2),
          y: cozyInterior.length - 2,
          pixelX: Math.floor(cozyInterior[0].length / 2) * CELL_SIZE,
          pixelY: (cozyInterior.length - 2) * CELL_SIZE,
        },
        camera: {
          x: Math.floor(cozyInterior[0].length / 2) * CELL_SIZE,
          y: (cozyInterior.length - 2) * CELL_SIZE,
        },
      };
    }
  }

  // Handle exiting building interiors
  if (
    targetCell === "building_door" &&
    (currentScene === "general_store" ||
      currentScene === "blacksmith" ||
      currentScene === "cozy_house")
  ) {
    const townWorld = createTownSquare();
    // Position player outside the appropriate building
    let exitX = 14,
      exitY = 12; // Default to center

    if (currentScene === "general_store") {
      exitX = 5;
      exitY = 10; // In front of general store
    } else if (currentScene === "blacksmith") {
      exitX = 15;
      exitY = 5; // In front of blacksmith
    } else if (currentScene === "cozy_house") {
      exitX = 24;
      exitY = 11; // In front of cozy house
    }

    return {
      ...prevState,
      currentScene: "town_square",
      world: townWorld,
      player: {
        ...player,
        x: exitX,
        y: exitY,
        pixelX: exitX * CELL_SIZE,
        pixelY: exitY * CELL_SIZE,
      },
      camera: {
        x: exitX * CELL_SIZE,
        y: exitY * CELL_SIZE,
      },
    };
  }

  // Allow forge interaction in blacksmith, but otherwise only farming in exterior
  if (currentScene !== "exterior" && !(targetCell === "forge" && currentScene === "blacksmith")) {
    return prevState;
  }

  const newWorld = world.map(row => [...row]);
  const newInventory = { ...inventory };

  // Check if target is on farmable land
  const farmX = targetX - FARM_START_X;
  const farmY = targetY - FARM_START_Y;
  const isOnFarm =
    farmX >= 0 && farmX < FARM_SIZE && farmY >= 0 && farmY < FARM_SIZE;

  if (!isOnFarm) return prevState; // Can't farm outside the farm area

  const currentCell = newWorld[targetY][targetX];

  switch (selectedTool) {
    case "hoe":
      if (!currentCell) {
        newWorld[targetY][targetX] = {
          type: "tilled",
          stage: 0,
          maxStage: 0,
          watered: false,
          plantedAt: 0,
          wateringsReceived: 0,
          wateringsRequired: 0,
        };
      }
      break;

    case "parsnip":
    case "potato":
      const seedType = selectedTool as SeedType;
      if (
        currentCell &&
        typeof currentCell === "object" &&
        currentCell.type === "tilled" &&
        inventory.seeds[seedType] > 0
      ) {
        const seedConfig = getSeedConfig(seedType);
        newWorld[targetY][targetX] = {
          type: seedType,
          stage: 0,
          maxStage: seedConfig.maxStage,
          watered: false,
          plantedAt: Date.now(),
          wateringsReceived: 0,
          wateringsRequired: seedConfig.wateringsRequired,
        };
        newInventory.seeds = {
          ...newInventory.seeds,
          [seedType]: newInventory.seeds[seedType] - 1,
        };
      }
      break;

    case "watering_can":
      if (
        currentCell &&
        typeof currentCell === "object" &&
        currentCell.type !== "tilled" &&
        currentCell.wateringsReceived < currentCell.wateringsRequired
      ) {
        const newWaterings = currentCell.wateringsReceived + 1;
        newWorld[targetY][targetX] = {
          ...currentCell,
          watered: newWaterings >= currentCell.wateringsRequired,
          wateringsReceived: newWaterings,
        };
      }
      break;

    case "hand":
      if (
        currentCell &&
        typeof currentCell === "object" &&
        currentCell.type !== "tilled" &&
        currentCell.stage === currentCell.maxStage
      ) {
        const seedConfig = getSeedConfig(currentCell.type as SeedType);
        newInventory.crops++;
        newInventory.coins += seedConfig.sellPrice;
        newWorld[targetY][targetX] = null;
      }
      break;
  }

  return { ...prevState, world: newWorld, inventory: newInventory };
};

export const getCellDisplay = (cell: TerrainType): string => {
  if (cell === null) return "🟫"; // Farmable soil
  if (typeof cell === "string") {
    switch (cell) {
      case "grass":
        return "🟩";
      case "house_wall":
        return "🧱";
      case "house_floor":
        return "🟫";
      case "house_door":
        return "🚪";
      case "water":
        return "💧";
      case "tree":
        return "🌲";
      case "exit":
        return "🚪";
      case "furniture_bed":
        return "🛏️";
      case "furniture_table":
        return "🪑";
      case "furniture_chest":
        return "📦";
      case "stone_path":
        return "🟨";
      case "fountain":
        return "⛲";
      case "building_wall":
        return "🧱";
      case "building_floor":
        return "🟫";
      case "building_door":
        return "🚪";
      case "exit_to_town":
        return "🌆";
      case "exit_to_farm":
        return "🚜";
      case "fence":
        return "🔸";
      case "stone_wall":
        return "🧱";
      case "path":
        return "🟫";
      case "shop_counter":
        return "🛒";
      case "shop_shelf":
        return "📦";
      case "anvil":
        return "🔨";
      case "forge":
        return "🔥";
      case "kitchen_counter":
        return "🍽️";
      case "bookshelf":
        return "📚";
      case "display_case":
        return "💎";
      case "workbench":
        return "🔧";
      case "stove":
        return "🔥";
      default:
        return "❓";
    }
  }
  if (typeof cell === "object") {
    if (cell.type === "tilled") return "🟤";

    // Use the new seed system for crop display
    return getCropDisplay(cell);
  }
  return "❓";
};

export const formatTerrainForDebug = (terrain: TerrainType): string => {
  if (typeof terrain === "object") {
    return `crop(${terrain?.type}, stage:${terrain?.stage}, watered:${terrain?.wateringsReceived}/${terrain?.wateringsRequired})`;
  }
  return terrain || "null";
};
