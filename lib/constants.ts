// World dimensions
export const WORLD_WIDTH = 30;
export const WORLD_HEIGHT = 20;

// Farm area configuration
export const FARM_START_X = 10;
export const FARM_START_Y = 5;
export const FARM_SIZE = 10;

// Game rendering settings
export const CELL_SIZE = 48;
export const MOVE_SPEED = 4; // pixels per frame

// Camera settings
export const CAMERA_MOVE_SPEED = 0.1;

// Game timing
export const FPS = 60;
export const CROP_GROWTH_INTERVAL = 3000; // 3 seconds per growth stage

// Economy
export const CROP_SELL_PRICE = 50;
export const STARTING_SEEDS = 10;
export const STARTING_COINS = 100;

// Tool definitions
export const TOOLS = [
  { id: "hoe", icon: "🔨", name: "Hoe", key: "1" },
  { id: "seeds", icon: "🌱", name: "Seeds", key: "2" },
  { id: "watering_can", icon: "💧", name: "Water", key: "3" },
  { id: "hand", icon: "✋", name: "Harvest", key: "4" },
] as const;

// Input keys
export const MOVEMENT_KEYS = [
  "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", 
  "w", "a", "s", "d", "W", "A", "S", "D"
] as const;

export const GAME_CONTROL_KEYS = [
  ...MOVEMENT_KEYS,
  " ", "1", "2", "3", "4", "F3", "f3"
] as const;

// Solid terrain types for collision detection
export const SOLID_TERRAIN_TYPES = ["house_wall", "water", "tree"] as const;