import { TerrainType } from "./types";
import { WORLD_WIDTH, WORLD_HEIGHT, FARM_START_X, FARM_START_Y, FARM_SIZE } from "./constants";

export const createWorld = (): TerrainType[][] => {
  const world = Array(WORLD_HEIGHT)
    .fill(null)
    .map(() => Array(WORLD_WIDTH).fill("grass"));

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

  // Add water feature (bottom right)
  for (let y = 22; y < 28; y++) {
    for (let x = 32; x < 38; x++) {
      world[y][x] = "water";
    }
  }

  // Create perimeter fence around entire external scene
  for (let x = 0; x < WORLD_WIDTH; x++) {
    world[0][x] = "fence"; // Top edge
    world[WORLD_HEIGHT - 1][x] = "fence"; // Bottom edge
  }
  for (let y = 0; y < WORLD_HEIGHT; y++) {
    world[y][0] = "fence"; // Left edge
    world[y][WORLD_WIDTH - 1] = "fence"; // Right edge
  }

  // Add trees just inside the fence perimeter for forest atmosphere
  const treePositions = [
    // Inner perimeter trees (with path to city exit cleared)
    [1, 1], [1, 3], [1, 5], [1, 7], [1, 9], [1, 11], [1, 13], [1, 15], [1, 17], [1, 19], [1, 21], [1, 23], [1, 25], [1, 27], [1, 29], [1, 31], [1, 33], [1, 35], [1, 37], [1, 38],
    [2, 1], [2, 37], [2, 38], [3, 1], [3, 37], [3, 38], [4, 1], [4, 37], [4, 38], [5, 1], [5, 37], [5, 38], [6, 1], [6, 37], [6, 38], [7, 1], [7, 37], [7, 38], [8, 1], [8, 37], [8, 38], [9, 1], [9, 37], [9, 38], [10, 1], [10, 37], [10, 38], [11, 1], [11, 37], [11, 38], [12, 1], [12, 37], [12, 38], [13, 1], [13, 37], [13, 38], [14, 1], [15, 1], [16, 1], [17, 1], [17, 37], [17, 38], [18, 1], [18, 37], [18, 38], [19, 1], [19, 37], [19, 38], [20, 1], [20, 37], [20, 38], [21, 1], [21, 37], [21, 38], [22, 1], [22, 37], [22, 38], [23, 1], [23, 37], [23, 38], [24, 1], [24, 37], [24, 38], [25, 1], [25, 37], [25, 38], [26, 1], [26, 37], [26, 38], [27, 1], [27, 37], [27, 38],
    [28, 1], [28, 3], [28, 5], [28, 7], [28, 9], [28, 11], [28, 13], [28, 15], [28, 17], [28, 19], [28, 21], [28, 23], [28, 25], [28, 27], [28, 29], [28, 31], [28, 33], [28, 35], [28, 37], [28, 38],
    // Some scattered interior trees for atmosphere (avoiding path area)
    [5, 10], [5, 30], [8, 15], [8, 25], [12, 8], [12, 32], [16, 12], [20, 6], [20, 34], [24, 18], [24, 22],
  ];

  treePositions.forEach(([y, x]) => {
    if (y >= 0 && y < WORLD_HEIGHT && x >= 0 && x < WORLD_WIDTH) {
      world[y][x] = "tree";
    }
  });

  // Farm area stays as null (farmable land)
  for (let y = FARM_START_Y; y < FARM_START_Y + FARM_SIZE; y++) {
    for (let x = FARM_START_X; x < FARM_START_X + FARM_SIZE; x++) {
      world[y][x] = null;
    }
  }

  // Add pathways for navigation
  // Path from house to farm area
  const houseDoorX = 4;
  const houseDoorY = 4;
  for (let y = houseDoorY; y <= FARM_START_Y - 1; y++) {
    if (world[y][houseDoorX] !== "water" && world[y][houseDoorX] !== "house_wall" && world[y][houseDoorX] !== "house_floor") {
      world[y][houseDoorX] = "path";
    }
  }
  // Horizontal path to center of farm
  for (let x = houseDoorX; x <= FARM_START_X + Math.floor(FARM_SIZE / 2); x++) {
    if (world[FARM_START_Y - 1][x] !== "water") {
      world[FARM_START_Y - 1][x] = "path";
    }
  }

  // Create fence opening on right side for town exit
  const exitY = Math.floor(WORLD_HEIGHT / 2); // Middle of world height
  const exitX = WORLD_WIDTH - 1; // Right edge
  
  // Create 3-tile opening in the fence
  world[exitY - 1][exitX] = "exit_to_town"; // Top exit tile
  world[exitY][exitX] = "exit_to_town"; // Middle exit tile  
  world[exitY + 1][exitX] = "exit_to_town"; // Bottom exit tile
  
  // Path from farm to the fence opening
  // Also clear a wider corridor around the main path for easier navigation
  for (let x = FARM_START_X + FARM_SIZE; x < exitX; x++) {
    // Clear the main path line
    if (world[exitY][x] !== "water") {
      world[exitY][x] = "path";
    }
    // Clear one tile above and below the path for easier movement
    if (exitY - 1 >= 0 && world[exitY - 1][x] === "tree") {
      world[exitY - 1][x] = "grass";
    }
    if (exitY + 1 < WORLD_HEIGHT && world[exitY + 1][x] === "tree") {
      world[exitY + 1][x] = "grass";
    }
  }

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
      if (y === 0 || y === INTERIOR_HEIGHT - 1 || x === 0 || x === INTERIOR_WIDTH - 1) {
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
    [0, 0], [0, 5], [0, 10], [0, 20], [0, 25], [0, 29],
    [24, 0], [24, 5], [24, 10], [24, 15], [24, 20], [24, 29],
    [10, 0], [15, 0], [20, 0]
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
  for (let y = Math.min(townEntranceY, 9); y <= Math.max(townEntranceY, 9); y++) {
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
      if (y === 0 || y === STORE_HEIGHT - 1 || x === 0 || x === STORE_WIDTH - 1) {
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
      if (y === 0 || y === BLACKSMITH_HEIGHT - 1 || x === 0 || x === BLACKSMITH_WIDTH - 1) {
        blacksmith[y][x] = "building_wall";
      }
    }
  }

  // Add exit door at bottom center
  blacksmith[BLACKSMITH_HEIGHT - 1][Math.floor(BLACKSMITH_WIDTH / 2)] = "building_door";

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