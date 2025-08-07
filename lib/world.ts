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
  world[2][3] = "house_door";

  // Add water feature (right side)
  for (let y = 2; y < 8; y++) {
    for (let x = 25; x < 29; x++) {
      world[y][x] = "water";
    }
  }

  // Add some trees around the edges
  const treePositions = [
    [0, 0], [0, 1], [0, 8], [0, 15], [0, 25], [0, 29],
    [1, 0], [1, 29], [8, 0], [8, 29], [15, 0], [15, 29],
    [19, 0], [19, 1], [19, 8], [19, 15], [19, 25], [19, 29],
  ];

  treePositions.forEach(([y, x]) => {
    if (y < WORLD_HEIGHT && x < WORLD_WIDTH) {
      world[y][x] = "tree";
    }
  });

  // Farm area stays as null (farmable land)
  for (let y = FARM_START_Y; y < FARM_START_Y + FARM_SIZE; y++) {
    for (let x = FARM_START_X; x < FARM_START_X + FARM_SIZE; x++) {
      world[y][x] = null;
    }
  }

  return world;
};