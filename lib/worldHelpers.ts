import { TerrainType } from "./types";
import {
  WORLD_WIDTH,
  WORLD_HEIGHT,
  FARM_START_X,
  FARM_START_Y,
  FARM_SIZE,
} from "./constants";

// Helper function to create arena exit
export const createArenaExit = (world: TerrainType[][]): void => {
  const arenaExitY = Math.floor(WORLD_HEIGHT / 2);
  const arenaExitX = 1;

  // Create 3-tile opening in the fence for arena access
  world[arenaExitY - 1][arenaExitX] = "exit_to_arena";
  world[arenaExitY][arenaExitX] = "exit_to_arena";
  world[arenaExitY + 1][arenaExitX] = "exit_to_arena";

  // Also clear the tree perimeter at arena exit location
  world[arenaExitY - 1][0] = "exit_to_arena";
  world[arenaExitY][0] = "exit_to_arena";  
  world[arenaExitY + 1][0] = "exit_to_arena";

  // Clear fence positions in front of arena entrance
  world[arenaExitY - 1][arenaExitX + 1] = "grass";
  world[arenaExitY][arenaExitX + 1] = "grass";
  world[arenaExitY + 1][arenaExitX + 1] = "grass";
};

// Helper function to create town exit
export const createTownExit = (world: TerrainType[][]): void => {
  const exitY = Math.floor(WORLD_HEIGHT / 2);
  const exitX = WORLD_WIDTH - 1;

  // Create 3-tile opening at the edge for town access
  world[exitY - 1][exitX] = "exit_to_town";
  world[exitY][exitX] = "exit_to_town";
  world[exitY + 1][exitX] = "exit_to_town";

  // Clear the fence at exit location to make room for path
  world[exitY - 1][WORLD_WIDTH - 2] = "grass";
  world[exitY][WORLD_WIDTH - 2] = "grass";
  world[exitY + 1][WORLD_WIDTH - 2] = "grass";
};

// Helper function to create pathways
export const createPathways = (world: TerrainType[][]): void => {
  const exitY = Math.floor(WORLD_HEIGHT / 2);
  const exitX = WORLD_WIDTH - 1;
  const arenaExitY = Math.floor(WORLD_HEIGHT / 2);

  // Path from house to farm area
  const houseDoorX = 4;
  const houseDoorY = 4;
  for (let y = houseDoorY; y <= FARM_START_Y - 1; y++) {
    if (
      world[y][houseDoorX] !== "water" &&
      world[y][houseDoorX] !== "house_wall" &&
      world[y][houseDoorX] !== "house_floor"
    ) {
      world[y][houseDoorX] = "path";
    }
  }

  // Horizontal path to center of farm
  for (let x = houseDoorX; x <= FARM_START_X + Math.floor(FARM_SIZE / 2); x++) {
    if (world[FARM_START_Y - 1][x] !== "water") {
      world[FARM_START_Y - 1][x] = "path";
    }
  }

  // Path from farm to the town exit (right side)
  for (let x = FARM_START_X + FARM_SIZE; x <= exitX; x++) {
    if (world[exitY][x] !== "water") {
      world[exitY][x] = "path";
    }
    // Clear one tile above and below the path for easier movement
    if (exitY - 1 >= 0 && (world[exitY - 1][x] === "tree" || world[exitY - 1][x] === "fence")) {
      world[exitY - 1][x] = "grass";
    }
    if (exitY + 1 < WORLD_HEIGHT && (world[exitY + 1][x] === "tree" || world[exitY + 1][x] === "fence")) {
      world[exitY + 1][x] = "grass";
    }
  }

  // Path from farm to the arena exit (left side)
  for (let x = 2; x < FARM_START_X; x++) {
    if (world[arenaExitY][x] !== "water") {
      world[arenaExitY][x] = "path";
    }
    // Clear one tile above and below the path for easier movement
    if (arenaExitY - 1 >= 0 && (world[arenaExitY - 1][x] === "tree" || world[arenaExitY - 1][x] === "fence")) {
      world[arenaExitY - 1][x] = "grass";
    }
    if (arenaExitY + 1 < WORLD_HEIGHT && (world[arenaExitY + 1][x] === "tree" || world[arenaExitY + 1][x] === "fence")) {
      world[arenaExitY + 1][x] = "grass";
    }
  }
};

// Helper function to create farm area
export const createFarmArea = (world: TerrainType[][]): void => {
  // Farm area stays as null (farmable land)
  for (let y = FARM_START_Y; y < FARM_START_Y + FARM_SIZE; y++) {
    for (let x = FARM_START_X; x < FARM_START_X + FARM_SIZE; x++) {
      world[y][x] = null;
    }
  }
};

// Helper function to create interior trees
export const createInteriorTrees = (world: TerrainType[][]): void => {
  const interiorTreePositions = [
    [5, 10], [5, 30], [8, 15], [8, 25], [12, 8], [12, 32], 
    [16, 12], [20, 6], [20, 34], [24, 18], [24, 22],
  ];

  interiorTreePositions.forEach(([y, x]) => {
    if (y >= 0 && y < WORLD_HEIGHT && x >= 0 && x < WORLD_WIDTH) {
      world[y][x] = "tree";
    }
  });
};

// Helper function to create the fencing system
export const createFencing = (world: TerrainType[][]): void => {
  // Fence positions - skip areas where arena and town exits are located
  const fencePositions = [
    // Inner perimeter fence (with gaps for both exits cleared)
    [1, 1], [1, 3], [1, 5], [1, 7], [1, 9], [1, 11],
    // Skip [1, 13], [1, 14], [1, 15] for arena exit
    [1, 17], [1, 19], [1, 21], [1, 23], [1, 25], [1, 27], [1, 29], [1, 31], [1, 33], [1, 35], [1, 37], [1, 38],
    [2, 1], [2, 37], [2, 38],
    [3, 1], [3, 37], [3, 38],
    [4, 1], [4, 37], [4, 38],
    [5, 1], [5, 37], [5, 38],
    [6, 1], [6, 37], [6, 38],
    [7, 1], [7, 37], [7, 38],
    [8, 1], [8, 37], [8, 38],
    [9, 1], [9, 37], [9, 38],
    [10, 1], [10, 37], [10, 38],
    [11, 1], [11, 37], [11, 38],
    [12, 1], [12, 37], [12, 38],
    [13, 1], [13, 37], [13, 38],
    // Skip [14, 1], [15, 1], [16, 1] for arena exit tiles
    // Skip [14, 2] for arena entrance clearance
    // Skip [15, 2] for arena entrance clearance  
    // Skip [16, 2] for arena entrance clearance
    [17, 1], [17, 37], [17, 38],
    [18, 1], [18, 37], [18, 38],
    [19, 1], [19, 37], [19, 38],
    [20, 1], [20, 37], [20, 38],
    [21, 1], [21, 37], [21, 38],
    [22, 1], [22, 37], [22, 38],
    [23, 1], [23, 37], [23, 38],
    [24, 1], [24, 37], [24, 38],
    [25, 1], [25, 37], [25, 38],
    [26, 1], [26, 37], [26, 38],
    [27, 1], [27, 37], [27, 38],
    [28, 1], [28, 3], [28, 5], [28, 7], [28, 9], [28, 11], [28, 13], [28, 15], 
    [28, 17], [28, 19], [28, 21], [28, 23], [28, 25], [28, 27], [28, 29], [28, 31], 
    [28, 33], [28, 35], [28, 37], [28, 38],
  ];

  fencePositions.forEach(([y, x]) => {
    if (y >= 0 && y < WORLD_HEIGHT && x >= 0 && x < WORLD_WIDTH) {
      world[y][x] = "fence";
    }
  });
};