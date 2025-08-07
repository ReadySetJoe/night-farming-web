import { TerrainType, Crop } from "./types";
import { SOLID_TERRAIN_TYPES, CELL_SIZE, WORLD_WIDTH, WORLD_HEIGHT } from "./constants";

export const isSolid = (terrain: TerrainType): boolean => {
  if (typeof terrain === "string") {
    return SOLID_TERRAIN_TYPES.includes(terrain as any);
  }
  return false; // Crops and farmable land are passable
};

export const checkCollision = (
  pixelX: number,
  pixelY: number,
  world: TerrainType[][]
): boolean => {
  // Check the grid position the player would be moving INTO
  const gridX = Math.round(pixelX / CELL_SIZE);
  const gridY = Math.round(pixelY / CELL_SIZE);

  // Check bounds
  if (
    gridX < 0 ||
    gridY < 0 ||
    gridX >= WORLD_WIDTH ||
    gridY >= WORLD_HEIGHT
  ) {
    return true; // Out of bounds is solid
  }

  const terrain = world[gridY][gridX];
  return isSolid(terrain);
};