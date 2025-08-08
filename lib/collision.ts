import { TerrainType } from "./types";
import {
  SOLID_TERRAIN_TYPES,
  CELL_SIZE,
  WORLD_WIDTH,
  WORLD_HEIGHT,
} from "./constants";

export const isSolid = (terrain: TerrainType): boolean => {
  if (typeof terrain === "string") {
    return SOLID_TERRAIN_TYPES.includes(
      terrain as (typeof SOLID_TERRAIN_TYPES)[number]
    );
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

  // Use actual world dimensions instead of hardcoded constants
  const currentWorldHeight = world.length;
  const currentWorldWidth = world[0]?.length || 0;

  // Check bounds
  if (gridX < 0 || gridY < 0 || gridX >= currentWorldWidth || gridY >= currentWorldHeight) {
    return true; // Out of bounds is solid
  }

  const terrain = world[gridY][gridX];
  return isSolid(terrain);
};
