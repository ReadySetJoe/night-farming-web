import { TerrainType } from "./types";
import {
  WORLD_WIDTH,
  WORLD_HEIGHT,
} from "./constants";
import {
  createArenaExit,
  createTownExit,
  createPathways,
  createFarmArea,
  createInteriorTrees,
  createFencing,
} from "./worldHelpers";

// Helper function to create the basic house structure
const createHouse = (world: TerrainType[][]): void => {
  // Add house (top-left area)
  for (let y = 1; y < 4; y++) {
    for (let x = 2; x < 6; x++) {
      if (y === 1 || y === 3 || x === 2 || x === 5) {
        world[y][x] = "house_wall";
      } else {
        world[y][x] = "house_floor";
      }
    }
  }
  // Place door on the front (bottom) of the house
  world[3][4] = "house_door";
};

// Helper function to add water features
const createWaterFeature = (world: TerrainType[][]): void => {
  // Add water feature (bottom right)
  for (let y = 22; y < 28; y++) {
    for (let x = 32; x < 38; x++) {
      world[y][x] = "water";
    }
  }
};

// Helper function to create perimeter trees
const createPerimeterTrees = (world: TerrainType[][]): void => {
  // Create perimeter trees around entire external scene for forest atmosphere
  for (let x = 0; x < WORLD_WIDTH; x++) {
    world[0][x] = "tree"; // Top edge
    world[WORLD_HEIGHT - 1][x] = "tree"; // Bottom edge
  }
  for (let y = 0; y < WORLD_HEIGHT; y++) {
    world[y][0] = "tree"; // Left edge
    world[y][WORLD_WIDTH - 1] = "tree"; // Right edge
  }
};

export const createWorld = (): TerrainType[][] => {
  const world = Array(WORLD_HEIGHT)
    .fill(null)
    .map(() => Array(WORLD_WIDTH).fill("grass"));

  // Add main features
  createHouse(world);
  createWaterFeature(world);
  createPerimeterTrees(world);
  
  // Create exits and fencing system
  createArenaExit(world);
  createFencing(world);
  createTownExit(world);
  createPathways(world);
  createFarmArea(world);
  createInteriorTrees(world);

  return world;
};

export const createHouseInterior = (): TerrainType[][] => {
  // Create a smaller interior world (12x8 to fit about half screen)
  const INTERIOR_WIDTH = 12;
  const INTERIOR_HEIGHT = 8;

  const interior = Array(INTERIOR_HEIGHT)
    .fill(null)
    .map(() => Array(INTERIOR_WIDTH).fill("house_floor"));

  // Add walls around the perimeter
  for (let y = 0; y < INTERIOR_HEIGHT; y++) {
    for (let x = 0; x < INTERIOR_WIDTH; x++) {
      if (
        y === 0 ||
        y === INTERIOR_HEIGHT - 1 ||
        x === 0 ||
        x === INTERIOR_WIDTH - 1
      ) {
        interior[y][x] = "house_wall";
      }
    }
  }

  // Add exit door at bottom center
  interior[INTERIOR_HEIGHT - 1][Math.floor(INTERIOR_WIDTH / 2)] = "house_door";

  // Add some furniture
  interior[2][2] = "furniture_bed";
  interior[2][9] = "furniture_table";
  interior[5][9] = "furniture_chest";

  return interior;
};

export const createTownSquare = (): TerrainType[][] => {
  // Create a medium-sized town square (30x25)
  const TOWN_WIDTH = 30;
  const TOWN_HEIGHT = 25;

  const town = Array(TOWN_HEIGHT)
    .fill(null)
    .map(() => Array(TOWN_WIDTH).fill("grass"));

  // Add central square with cobblestone (stone_path)
  for (let y = 8; y < 17; y++) {
    for (let x = 10; x < 20; x++) {
      town[y][x] = "stone_path";
    }
  }

  // Add fountain in center of square
  town[12][14] = "fountain";
  town[12][15] = "fountain";
  town[13][14] = "fountain";
  town[13][15] = "fountain";

  // Add buildings around the square
  // General store (left side)
  for (let y = 5; y < 10; y++) {
    for (let x = 2; x < 8; x++) {
      if (y === 5 || y === 9 || x === 2 || x === 7) {
        town[y][x] = "building_wall";
      } else {
        town[y][x] = "building_floor";
      }
    }
  }
  town[9][5] = "building_door"; // Store entrance

  // House (right side)
  for (let y = 6; y < 11; y++) {
    for (let x = 22; x < 27; x++) {
      if (y === 6 || y === 10 || x === 22 || x === 26) {
        town[y][x] = "building_wall";
      } else {
        town[y][x] = "building_floor";
      }
    }
  }
  town[10][24] = "building_door"; // House entrance

  // Blacksmith (top)
  for (let y = 1; y < 5; y++) {
    for (let x = 12; x < 18; x++) {
      if (y === 1 || y === 4 || x === 12 || x === 17) {
        town[y][x] = "building_wall";
      } else {
        town[y][x] = "building_floor";
      }
    }
  }
  town[4][15] = "building_door"; // Blacksmith entrance

  // Add some decorative elements
  // Trees around the edge
  const treePosisions = [
    [0, 0],
    [0, 5],
    [0, 10],
    [0, 20],
    [0, 25],
    [0, 29],
    [24, 0],
    [24, 5],
    [24, 10],
    [24, 15],
    [24, 20],
    [24, 29],
    [10, 0],
    [15, 0],
    [20, 0],
  ];

  treePosisions.forEach(([y, x]) => {
    if (y < TOWN_HEIGHT && x < TOWN_WIDTH) {
      town[y][x] = "tree";
    }
  });

  // Create 3-tile vertical entrance system on the far left edge
  // All 3 tiles are functional exits to farm
  const townEntranceX = 0; // All the way to the left edge
  const townEntranceY = Math.floor(TOWN_HEIGHT / 2); // Middle of town height

  town[townEntranceY - 1][townEntranceX] = "exit_to_farm"; // Top exit tile
  town[townEntranceY][townEntranceX] = "exit_to_farm"; // Middle exit tile
  town[townEntranceY + 1][townEntranceX] = "exit_to_farm"; // Bottom exit tile

  // Add pathways connecting all buildings
  // Path from entrance to general store (left side)
  for (let x = townEntranceX + 1; x <= 8; x++) {
    if (town[townEntranceY][x] === "grass") {
      town[townEntranceY][x] = "path";
    }
  }

  // Vertical path from entrance level to general store door
  for (
    let y = Math.min(townEntranceY, 9);
    y <= Math.max(townEntranceY, 9);
    y++
  ) {
    if (town[y][8] === "grass") {
      town[y][8] = "path";
    }
  }

  // Path from general store to blacksmith (via central square)
  // Horizontal path to central square
  for (let x = 8; x <= 10; x++) {
    if (town[7][x] === "grass") {
      town[7][x] = "path";
    }
  }

  // Vertical path up central square to blacksmith
  for (let y = 5; y <= 8; y++) {
    if (town[y][15] === "grass") {
      town[y][15] = "path";
    }
  }

  // Path from blacksmith to house (right side)
  // Horizontal path from blacksmith area to house area
  for (let x = 15; x <= 22; x++) {
    if (town[7][x] === "grass") {
      town[7][x] = "path";
    }
  }

  // Vertical path from horizontal path to house door
  for (let y = 7; y <= 10; y++) {
    if (town[y][22] === "grass") {
      town[y][22] = "path";
    }
  }

  // Path from house back to central square (completing the loop)
  // Horizontal path from house to central square
  for (let x = 19; x >= 20; x--) {
    if (town[13][x] === "grass") {
      town[13][x] = "path";
    }
  }

  // Connection from house area back to entrance path
  for (let x = 8; x <= 22; x++) {
    if (town[13][x] === "grass") {
      town[13][x] = "path";
    }
  }

  return town;
};

export const createGeneralStoreInterior = (): TerrainType[][] => {
  // Create store interior (10x8)
  const STORE_WIDTH = 10;
  const STORE_HEIGHT = 8;

  const store = Array(STORE_HEIGHT)
    .fill(null)
    .map(() => Array(STORE_WIDTH).fill("building_floor"));

  // Add walls around the perimeter
  for (let y = 0; y < STORE_HEIGHT; y++) {
    for (let x = 0; x < STORE_WIDTH; x++) {
      if (
        y === 0 ||
        y === STORE_HEIGHT - 1 ||
        x === 0 ||
        x === STORE_WIDTH - 1
      ) {
        store[y][x] = "building_wall";
      }
    }
  }

  // Add exit door at bottom center
  store[STORE_HEIGHT - 1][Math.floor(STORE_WIDTH / 2)] = "building_door";

  // Add shop fixtures
  // Counter along right wall
  store[3][7] = "shop_counter";
  store[4][7] = "shop_counter";
  store[5][7] = "shop_counter";

  // Shelves along left wall
  store[2][2] = "shop_shelf";
  store[3][2] = "shop_shelf";
  store[4][2] = "shop_shelf";
  store[5][2] = "shop_shelf";

  // Display cases in corners
  store[2][7] = "display_case";
  store[6][2] = "display_case";

  return store;
};

export const createBlacksmithInterior = (): TerrainType[][] => {
  // Create blacksmith interior (10x8)
  const BLACKSMITH_WIDTH = 10;
  const BLACKSMITH_HEIGHT = 8;

  const blacksmith = Array(BLACKSMITH_HEIGHT)
    .fill(null)
    .map(() => Array(BLACKSMITH_WIDTH).fill("building_floor"));

  // Add walls around the perimeter
  for (let y = 0; y < BLACKSMITH_HEIGHT; y++) {
    for (let x = 0; x < BLACKSMITH_WIDTH; x++) {
      if (
        y === 0 ||
        y === BLACKSMITH_HEIGHT - 1 ||
        x === 0 ||
        x === BLACKSMITH_WIDTH - 1
      ) {
        blacksmith[y][x] = "building_wall";
      }
    }
  }

  // Add exit door at bottom center
  blacksmith[BLACKSMITH_HEIGHT - 1][Math.floor(BLACKSMITH_WIDTH / 2)] =
    "building_door";

  // Add blacksmith fixtures
  // Forge in top-left corner
  blacksmith[2][2] = "forge";
  blacksmith[2][3] = "forge";

  // Anvil near forge
  blacksmith[4][3] = "anvil";

  // Workbenches along right wall
  blacksmith[3][7] = "workbench";
  blacksmith[4][7] = "workbench";
  blacksmith[5][7] = "workbench";

  return blacksmith;
};

export const createCozyHouseInterior = (): TerrainType[][] => {
  // Create cozy house interior (12x10)
  const COZY_WIDTH = 12;
  const COZY_HEIGHT = 10;

  const cozyHouse = Array(COZY_HEIGHT)
    .fill(null)
    .map(() => Array(COZY_WIDTH).fill("building_floor"));

  // Add walls around the perimeter
  for (let y = 0; y < COZY_HEIGHT; y++) {
    for (let x = 0; x < COZY_WIDTH; x++) {
      if (y === 0 || y === COZY_HEIGHT - 1 || x === 0 || x === COZY_WIDTH - 1) {
        cozyHouse[y][x] = "building_wall";
      }
    }
  }

  // Add exit door at bottom center
  cozyHouse[COZY_HEIGHT - 1][Math.floor(COZY_WIDTH / 2)] = "building_door";

  // Add furniture for cozy home
  // Bedroom area (top-left)
  cozyHouse[2][2] = "furniture_bed";
  cozyHouse[2][9] = "bookshelf";

  // Kitchen area (top-right)
  cozyHouse[3][8] = "kitchen_counter";
  cozyHouse[4][8] = "kitchen_counter";
  cozyHouse[2][7] = "stove";

  // Living area (bottom)
  cozyHouse[6][3] = "furniture_table";
  cozyHouse[7][9] = "furniture_chest";

  return cozyHouse;
};

export const createArena = (): TerrainType[][] => {
  // Create a small arena (20x15)
  const ARENA_WIDTH = 20;
  const ARENA_HEIGHT = 15;

  const arena = Array(ARENA_HEIGHT)
    .fill(null)
    .map(() => Array(ARENA_WIDTH).fill("stone_path")); // Stone floor for arena

  // Add arena walls around the perimeter
  for (let y = 0; y < ARENA_HEIGHT; y++) {
    for (let x = 0; x < ARENA_WIDTH; x++) {
      if (y === 0 || y === ARENA_HEIGHT - 1 || x === 0 || x === ARENA_WIDTH - 1) {
        arena[y][x] = "stone_wall";
      }
    }
  }

  // Create entrance on the right side (leading back to farm)
  const entranceY = Math.floor(ARENA_HEIGHT / 2);
  const entranceX = ARENA_WIDTH - 1;
  
  // Create 3-tile entrance
  arena[entranceY - 1][entranceX] = "exit_to_farm";
  arena[entranceY][entranceX] = "exit_to_farm";  
  arena[entranceY + 1][entranceX] = "exit_to_farm";

  // Add some decorative elements
  // Corner torches/braziers (using forge emoji for now)
  arena[2][2] = "forge";
  arena[2][ARENA_WIDTH - 3] = "forge";
  arena[ARENA_HEIGHT - 3][2] = "forge";
  arena[ARENA_HEIGHT - 3][ARENA_WIDTH - 3] = "forge";

  return arena;
};
